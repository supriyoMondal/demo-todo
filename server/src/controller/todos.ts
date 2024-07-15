import type { Request, Response } from "express";
import { mutators } from "shared-mutations";
import { z } from "zod";
import { handleError } from "../utils/handleError";
import { db } from "../db";
import { replicacheClient, todo } from "../db/schema";
import { and, eq, gt } from "drizzle-orm";
import type { ClientID, PatchOperation } from "replicache";
import { getCookie, setCookie, setLastMutationIDs } from "../utils/dbHelpers";
import { PostgresStorage } from "../utils/postgresStorage";
import { getPokeBackend } from "../utils/poke";
import { ReplicacheTransaction } from "replicache-transaction";

const spaceIdQuerySchema = z.object({
  spaceID: z.string(),
});

const mutationSchema = z.object({
  clientID: z.string(),
  id: z.number(),
  name: z.string(),
  args: z.any(),
});

const pushRequestSchema = z.object({
  profileID: z.string(),
  clientGroupID: z.string(),
  mutations: z.array(mutationSchema),
});

export const pushTodoController = async (req: Request, res: Response) => {
  try {
    console.log("Processing push");
    const { spaceID } = spaceIdQuerySchema.parse(req.query);
    const push = pushRequestSchema.parse(req.body);

    const { clientGroupID } = push;

    await db.transaction(async (tx) => {
      const prevVersion = await getCookie(spaceID);
      if (!prevVersion) {
        throw new Error("User space not found");
      }
      const nextVersion = prevVersion.version + 1;
      const clientIDs = [...new Set(push.mutations.map((m) => m.clientID))];

      const lastMutationIDArr = await Promise.all(
        clientIDs.map(async (clientID) => {
          const [lastMutationID] = await tx
            .select({ lastMutationId: replicacheClient.lastMutationId })
            .from(replicacheClient)
            .where(eq(replicacheClient.id, clientID));

          return [clientID, lastMutationID?.lastMutationId ?? 0];
        }) as Promise<[ClientID, number]>[]
      );

      const lastMutationIDs = lastMutationIDArr.reduce(
        (acc, [clientID, lastMutationID]) => {
          acc[clientID] = lastMutationID;
          return acc;
        },
        {} as Record<ClientID, number>
      );

      const storage = new PostgresStorage(spaceID, nextVersion, tx);

      const rpTransaction = new ReplicacheTransaction(storage);

      for (let i = 0; i < push.mutations.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const mutation = push.mutations[i]!;

        const { clientID } = mutation;
        const lastMutationID = lastMutationIDs[clientID];

        if (lastMutationID === undefined) {
          throw new Error("Last mutation ID not found");
        }

        const expectedMutationID = lastMutationID + 1;

        if (mutation.id < expectedMutationID) {
          console.log(
            `Mutation ${mutation.id} has already been processed - skipping`
          );
          continue;
        }

        if (mutation.id > expectedMutationID) {
          console.warn(`Mutation ${mutation.id} is from the future - aborting`);
          break;
        }

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const mutator = (mutators as any)[mutation.name];

        try {
          await mutator(rpTransaction, mutation.args);
        } catch (e) {
          console.error(
            `Error executing mutator: ${JSON.stringify(mutator)}: ${e}`
          );
        }

        lastMutationIDs[clientID] = expectedMutationID;
      }
      await Promise.all([
        setLastMutationIDs(clientGroupID, lastMutationIDs, nextVersion),
        setCookie(spaceID, nextVersion),
        rpTransaction.flush(),
      ]);

      const pokeBackend = getPokeBackend();

      pokeBackend.poke(spaceID);
    });
    console.log(" all mutations processed");
    return res.json({});
  } catch (error) {
    handleError(error, res);
  }
};

const pullRequest = z.object({
  profileID: z.string(),
  clientGroupID: z.string(),
  cookie: z.union([z.number(), z.null()]),
  schemaVersion: z.string(),
});

export type PullResponse = {
  cookie: number;
  lastMutationIDChanges: Record<ClientID, number>;
  patch: PatchOperation[];
};

export const pullTodoController = async (req: Request, res: Response) => {
  try {
    const { spaceID } = spaceIdQuerySchema.parse(req.query);
    const pull = pullRequest.parse(req.body);
    const { cookie: requestCookie } = pull;

    const sinceCookie = requestCookie ?? 0;

    const promises = [
      db
        .select()
        .from(todo)
        .where(
          and(
            eq(todo.userSpaceId, spaceID),
            gt(todo.version, sinceCookie),
            eq(todo.deleted, false)
          )
        )
        .orderBy(todo.lastModified),
      db
        .select()
        .from(replicacheClient)
        .where(
          and(
            eq(replicacheClient.clientGroupId, pull.clientGroupID),
            gt(replicacheClient.version, sinceCookie)
          )
        ),
      getCookie(spaceID),
    ] as const;

    const [todos, lastMutations, userSpaceVersion] = await Promise.all(
      promises
    );

    console.log("processed todos ", todos.length);

    if (!userSpaceVersion) {
      throw new Error("User space not found");
    }

    const resp: PullResponse = {
      lastMutationIDChanges: lastMutations.reduce((acc, cur) => {
        acc[cur.id] = cur.lastMutationId;
        return acc;
      }, {} as Record<ClientID, number>),
      cookie: userSpaceVersion.version,
      patch: [],
    };

    // biome-ignore lint/complexity/noForEach: <explanation>
    todos.forEach((todoItem) => {
      resp.patch.push({
        op: "put",
        key: todoItem.key,
        value: todoItem,
      });
    });

    return res.send(resp);
  } catch (error) {
    handleError(error, res);
  }
};

let pokeInterval: ReturnType<typeof setInterval>;
let unlisten: () => void;

export const pokeTodoController = async (req: Request, res: Response) => {
  try {
    const { spaceID } = spaceIdQuerySchema.parse(req.query);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");

    res.write(`id: ${Date.now()}\n`);
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    res.write(`data: hello\n\n`);

    const pokeBackend = getPokeBackend();

    if (unlisten) {
      unlisten();
    }

    unlisten = pokeBackend.addListener(spaceID as string, () => {
      console.log(`Sending poke for space ${spaceID}`);
      res.write(`id: ${Date.now()}\n`);
      // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
      res.write(`data: poke\n\n`);
    });

    if (pokeInterval) {
      clearInterval(pokeInterval);
    }

    pokeInterval = setInterval(() => {
      res.write(`id: ${Date.now()}\n`);
      // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
      res.write(`data: beat\n\n`);
    }, 30 * 1000);

    res.on("close", () => {
      console.log("Closing poke connection");
      unlisten();
    });
  } catch (error) {
    handleError(error, res);
  }
};

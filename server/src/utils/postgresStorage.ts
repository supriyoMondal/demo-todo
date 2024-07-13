import { and, eq, gt, type ExtractTablesWithRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ReadonlyJSONValue } from "replicache";
import { todo, TodoItemIn } from "../db/schema";
import { z } from "zod";

export class PostgresStorage {
  private _spaceID: string;
  private _version: number;
  private _pgClient: PgTransaction<
    NodePgQueryResultHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >;

  constructor(
    spaceID: string,
    version: number,
    pgClient: PgTransaction<
      NodePgQueryResultHKT,
      Record<string, never>,
      ExtractTablesWithRelations<Record<string, never>>
    >
  ) {
    this._spaceID = spaceID;
    this._version = version;
    this._pgClient = pgClient;
  }

  async putEntry(key: string, value: ReadonlyJSONValue): Promise<void> {
    const todoSchema = z.object({
      title: z.string(),
      description: z.string().optional().default(""),
      favorite: z.boolean().optional().default(false),
      completed: z.boolean().optional().default(false),
      deleted: z.boolean().optional().default(false),
      sort: z.number().optional().default(0),
    });

    console.log({ putKey: key, putValue: value });

    const { title, description, favorite, completed, deleted, sort } =
      todoSchema.parse(value);

    const isTodoAlreadyPresent = await this.hasEntry(key);

    if (isTodoAlreadyPresent) {
      await this._pgClient
        .update(todo)
        .set({
          title,
          description,
          favorite,
          completed,
          deleted,
          sort,
          //  @ts-ignore
          lastModified: new Date(),
          version: this._version,
        })
        .where(eq(todo.key, key));

      return;
    }

    const todoEntry: TodoItemIn = {
      id: key,
      title,
      description,
      // @ts-ignore
      createdAt: new Date(),
      //  @ts-ignore
      lastModified: new Date(),
      favorite,
      completed,
      key,
      deleted,
      userSpaceId: this._spaceID,
      version: this._version,
      sort,
    };

    await this._pgClient.insert(todo).values(todoEntry);
    console.log("todo created", todoEntry);
  }

  async hasEntry(key: string): Promise<boolean> {
    const todoItem = await this.getEntry(key);
    return !!todoItem;
  }

  async getEntry(key: string): Promise<ReadonlyJSONValue | undefined> {
    const [todoItem] = await this._pgClient
      .select()
      .from(todo)
      .where(and(eq(todo.key, key), eq(todo.userSpaceId, this._spaceID)));

    return todoItem;
  }

  getEntries(
    fromKey: string
  ): AsyncIterable<readonly [string, ReadonlyJSONValue]> {
    return entriesFromPGClient(this._pgClient, this._spaceID, fromKey);
  }

  async delEntry(key: string): Promise<void> {
    await this._pgClient
      .update(todo)
      .set({ deleted: true })
      .where(and(eq(todo.key, key), eq(todo.userSpaceId, this._spaceID)));
  }
}

async function* entriesFromPGClient(
  pgClient: PgTransaction<
    NodePgQueryResultHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
  >,
  spaceID: string,
  fromKey: string
): AsyncIterable<readonly [string, ReadonlyJSONValue]> {
  const todoItems = await pgClient
    .select()
    .from(todo)
    .where(and(eq(todo.userSpaceId, spaceID), gt(todo.id, fromKey)));

  for (const todoItem of todoItems) {
    yield [todoItem.id, todoItem];
  }
}

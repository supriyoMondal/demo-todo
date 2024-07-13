import { eq } from "drizzle-orm";
import { db, pgClient } from "../db";
import { replicacheClient, userSpace } from "../db/schema";

export const getCookie = async (spaceID: string) => {
  const [userSpaceVersion] = await db
    .select({ version: userSpace.version })
    .from(userSpace)
    .where(eq(userSpace.id, spaceID));

  return userSpaceVersion;
};

export const setCookie = async (spaceID: string, version: number) => {
  await db
    .update(userSpace)
    .set({ version, lastModified: new Date() })
    .where(eq(userSpace.id, spaceID));
};

export const setLastMutationID = async (
  clientID: string,
  clientGroupID: string,
  lastMutationID: number,
  version: number
) => {
  await db
    .insert(replicacheClient)
    .values({
      id: clientID,
      version,
      clientGroupId: clientGroupID,
      lastMutationId: lastMutationID,
      lastMutationTimestamp: new Date(),
    })
    .onConflictDoUpdate({
      target: replicacheClient.id,
      set: {
        lastMutationId: lastMutationID,
        lastMutationTimestamp: new Date(),
        version,
      },
    });
};

export const setLastMutationIDs = async (
  clientGroupID: string,
  lmids: Record<string, number>,
  version: number
) => {
  return await Promise.all(
    Object.entries(lmids).map(([clientID, lastMutationID]) =>
      setLastMutationID(clientID, clientGroupID, lastMutationID, version)
    )
  );
};

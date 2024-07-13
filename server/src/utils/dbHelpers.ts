import { eq } from "drizzle-orm";
import { db, pgClient } from "../db";
import { userSpace } from "../db/schema";

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
  await pgClient.query(
    `
    INSERT INTO replicache_client (id, last_mutation_id, last_mutation_timestamp, version, client_group_id)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (id) DO UPDATE SET
      last_mutation_id = $2,
      last_mutation_timestamp = $3,
      version = $4
    WHERE replicache_client.client_group_id = $5`,
    [clientID, lastMutationID, new Date(), version, clientGroupID]
  );
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

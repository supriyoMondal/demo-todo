import { and, eq, gt, type ExtractTablesWithRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ReadonlyJSONValue } from "replicache";
import type { Storage } from "replicache-transaction";
import { todo } from "../db/schema";

export class PostgresStorage implements Storage {
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
    throw new Error("Method not implemented.");
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

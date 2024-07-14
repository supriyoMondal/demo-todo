import type { ReadTransaction, ReadonlyJSONValue } from "replicache";

export type TodoItem = {
  userSpaceId: string;
  sort: number;
  id: string;
  version: number;
  lastModified: string;
  description: string;
  key: string;
  title: string;
  createdAt: string;
  favorite: boolean | null;
  completed: boolean | null;
  deleted: boolean;
  workSpace: string | null;
};

export type TodoUpdate = Partial<TodoItem> & Pick<TodoItem, "id">;

export async function listTodos<T extends ReadonlyJSONValue>(
  tx: ReadTransaction
) {
  return await tx.scan<T>({ prefix: "todo/" }).values().toArray();
}

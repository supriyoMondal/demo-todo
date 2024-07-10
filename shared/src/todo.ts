import type { ReadTransaction, ReadonlyJSONValue } from "replicache";

export type TodoItem = {
  id: string;
  title: string;
  description: string;
  sort: number;
};

export type TodoUpdate = Partial<TodoItem> & Pick<TodoItem, "id">;

export async function listTodos<T extends ReadonlyJSONValue>(
  tx: ReadTransaction
) {
  return await tx.scan<T>({ prefix: "todo/" }).values().toArray();
}

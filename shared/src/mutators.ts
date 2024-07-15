import type { WriteTransaction } from "replicache";
import { listTodos, TodoItem, TodoUpdate } from "./todo";

export type M = typeof mutators;

export const mutators = {
  updateTodo: async (tx: WriteTransaction, update: TodoUpdate) => {
    console.log("from update", update);

    const prev = await tx.get<TodoItem>(`todo/${update.id}`);
    const next = { ...prev, ...update };
    await tx.set(`todo/${next.id}`, next);
  },

  deleteTodo: async (tx: WriteTransaction, id: string) => {
    await tx.del(`todo/${id}`);
  },

  createTodo: async (tx: WriteTransaction, todo: Omit<TodoItem, "sort">) => {
    console.log("from create", todo);

    const todos = await listTodos<TodoItem>(tx);

    const maxSort =
      todos.length > 0 ? Math.max(...todos.map((t) => t.sort)) : 0;

    await tx.set(`todo/${todo.id}`, { ...todo, sort: maxSort + 1 });
  },
};

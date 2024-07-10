import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const replicacheMeta = pgTable("replicache_meta", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull(),
  value: varchar("value").notNull(),
});

export const userSpace = pgTable("user_space", {
  id: varchar("id").primaryKey(),
  version: integer("version").notNull(),
  lastModified: timestamp("last_modified").notNull(),
});

export const todo = pgTable(
  "todo",
  {
    id: serial("id").primaryKey(),
    userSpaceId: varchar("user_space_id")
      .references(() => userSpace.id, {
        onDelete: "cascade",
      })
      .notNull(),
    title: varchar("title").notNull(),
    description: varchar("description").notNull(),
    createdAt: timestamp("created_at").notNull().$type<string>(),
    lastModified: timestamp("last_modified").notNull().$type<string>(),
    favorite: boolean("favorite").default(false),
    sort: integer("sort").notNull(),
    completed: boolean("completed").default(false),
  },
  (table) => ({
    userSpaceIndex: index("todo_user_space_index").on(table.userSpaceId),
  })
);

export type TodoItem = InferSelectModel<typeof todo>;

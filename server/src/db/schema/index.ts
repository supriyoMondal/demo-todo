import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  boolean,
  index,
  json,
} from "drizzle-orm/pg-core";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const replicacheMeta = pgTable("replicache_meta", {
  key: varchar("key").notNull().primaryKey(),
  value: json("value").notNull(),
});

export const replicacheClient = pgTable("replicache_client", {
  id: varchar("id").primaryKey().notNull(),
  lastMutationId: integer("last_mutation_id").notNull(),
  lastMutationTimestamp: timestamp("last_mutation_timestamp").notNull(),
  version: integer("version").notNull(),
  clientGroupId: varchar("client_group_id").notNull(),
});

export const userSpace = pgTable("user_space", {
  id: varchar("id").primaryKey(),
  version: integer("version").notNull(),
  lastModified: timestamp("last_modified").notNull(),
});

export const todo = pgTable(
  "todo",
  {
    id: varchar("id").primaryKey(),
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
    completed: boolean("completed").default(false),
    version: integer("version").notNull(),
    key: varchar("key").notNull(),
    deleted: boolean("deleted").default(false).notNull(),
    sort: integer("sort").default(0).notNull(),
    workSpace: varchar("work_space"),
  },
  (table) => ({
    userSpaceIndex: index("todo_user_space_index").on(table.userSpaceId),
    versionIndex: index("todo_version_index").on(table.version),
  })
);

export const todoWorkSpace = pgTable("todo_workspace", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  userSpaceId: varchar("user_space_id").references(() => userSpace.id, {
    onDelete: "cascade",
  }),
});

export type TodoItem = InferSelectModel<typeof todo>;
export type TodoItemIn = InferInsertModel<typeof todo>;

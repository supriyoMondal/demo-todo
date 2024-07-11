ALTER TABLE "todo" ADD COLUMN "key" varchar NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todo_version_index" ON "todo" ("version");
CREATE TABLE IF NOT EXISTS "replicache_meta" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar NOT NULL,
	"value" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_space_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"created_at" timestamp NOT NULL,
	"last_modified" timestamp NOT NULL,
	"favorite" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_space" (
	"id" varchar PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"last_modified" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todo_user_space_index" ON "todo" ("user_space_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo" ADD CONSTRAINT "todo_user_space_id_user_space_id_fk" FOREIGN KEY ("user_space_id") REFERENCES "user_space"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

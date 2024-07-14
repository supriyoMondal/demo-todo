CREATE TABLE IF NOT EXISTS "todo_workspace" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"user_space_id" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todo_workspace" ADD CONSTRAINT "todo_workspace_user_space_id_user_space_id_fk" FOREIGN KEY ("user_space_id") REFERENCES "user_space"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

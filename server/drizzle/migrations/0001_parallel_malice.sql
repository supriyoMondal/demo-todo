ALTER TABLE "todo" ADD COLUMN "sort" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "completed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "version" integer NOT NULL;
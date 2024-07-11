CREATE TABLE IF NOT EXISTS "replicache_client" (
	"id" serial PRIMARY KEY NOT NULL,
	"last_mutation_id" integer NOT NULL,
	"last_mutation_timestamp" timestamp NOT NULL,
	"version" integer NOT NULL,
	"client_group_id" varchar NOT NULL
);

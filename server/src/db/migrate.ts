import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from ".";

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle/migrations" });
  process.exit(0);
}

main();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ENV } from "../config/envs";

export const pgClient = new Pool({
  connectionString: ENV.DATABASE_URL,
});

(async () => {
  try {
    await pgClient.connect();
    console.log("Connected to Postgres DB");
  } catch (error: any) {
    console.log("Error connecting to Postgres DB:", error.message);
  }
})();

export const db = drizzle(pgClient);

import type { Config } from "drizzle-kit";
import { ENV } from "./src/config/envs";

export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: ENV.DATABASE_URL,
  },
} satisfies Config;

import { pgClient } from "./db";

export const testConnection = async () => {
  try {
    const data = await pgClient.query("SELECT NOW()");
    console.log(data.rows);
  } catch (error) {
    console.log(error);
  } finally {
    process.exit(0);
  }
};

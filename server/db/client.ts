import { Pool } from "postgres";
import { dbConfig } from "./config.ts";

export const pool = new Pool(dbConfig, 10);

export async function executeQuery<T>(query: string, params?: (string | undefined)[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    console.debug(`Executing query: ${query} with params: ${JSON.stringify(params || [])}`);
    const result = await client.queryObject<T>(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function checkPoolHealth() {
  try {
    const client = await pool.connect();
    await client.queryObject("SELECT 1");
    client.release();
    console.log("Database connection healthy");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

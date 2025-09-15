import { Client } from "postgres";
import { dbConfig } from "./config.ts";
import { runMigrations } from "./migrations.ts";

export async function initializeDatabase() {
  let client: Client | null = null;

  try {
    const systemClient = new Client({ ...dbConfig, database: "postgres" });  // Connect to default system database
    await systemClient.connect();

    const dbExistsResult = await systemClient.queryObject<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)`,
      [dbConfig.database]
    );

    if (!dbExistsResult.rows[0].exists) {
      console.log(`\x1b[33mCreating database: \x1b[36m${dbConfig.database}\x1b[33m...\x1b[0m`);
      await systemClient.queryObject(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`\x1b[32mDatabase created successfully.\x1b[0m`);
    }

    await systemClient.end();

    client = new Client(dbConfig);
    await client.connect();

    console.log("\x1b[33mCreating \x1b[36mpgcrypto\x1b[33m extension...\x1b[0m");
    await client.queryObject(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `);

    console.log("\x1b[33mCreating \x1b[36muid_seq\x1b[33m sequence...\x1b[0m");
    await client.queryObject(`
      CREATE SEQUENCE IF NOT EXISTS uid_seq;
    `);

    console.log("\x1b[33mCreating \x1b[36mgenerate_base62_uid\x1b[33m function...\x1b[0m");
    await client.queryObject(`
      CREATE OR REPLACE FUNCTION generate_base62_uid() RETURNS char(8) AS $$
      DECLARE
        seq_val bigint;
        chars text := '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        hash_text text;
      BEGIN
        seq_val := nextval('uid_seq');
        hash_text := encode(digest(seq_val::text || random()::text, 'sha256'), 'hex');

        RETURN
          -- Sequential part (4 chars) with explicit integer casting
          substr(chars, ((seq_val / 14776336) % 62 + 1)::integer, 1) ||  -- 62^3
          substr(chars, ((seq_val / 238328) % 62 + 1)::integer, 1) ||    -- 62^2
          substr(chars, ((seq_val / 3844) % 62 + 1)::integer, 1) ||      -- 62^1
          substr(chars, (seq_val % 62 + 1)::integer, 1) ||               -- 62^0
          -- Random part (4 chars)
          substr(translate(substr(hash_text, 1, 8),'abcdef','ABCDEF'),1,4);
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("\x1b[33mRunning database migrations...\x1b[0m");
    await runMigrations(client)

    console.log("\x1b[32mDatabase initialization completed successfully!\x1b[0m");

  } catch (error) {
    console.error("\x1b[31mDatabase initialization failed:\x1b[0m", error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

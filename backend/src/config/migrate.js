import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsPath = join(__dirname, "../migrations");

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const { rows: ranMigrations } = await client.query(
      "SELECT filename FROM migrations"
    );
    const ranFiles = ranMigrations.map((r) => r.filename);

    const files = readdirSync(migrationsPath)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migration files found.");
      return;
    }

    let ranCount = 0;

    for (const file of files) {
      if (ranFiles.includes(file)) {
        console.log(`Skipping ${file} — already ran`);
        continue;
      }

      const filePath = join(migrationsPath, file);
      const sql = readFileSync(filePath, "utf8");

      console.log(` Running ${file}...`);

      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        "INSERT INTO migrations (filename) VALUES ($1)",
        [file]
      );
      await client.query("COMMIT");

      console.log(` ${file} ran successfully`);
      ranCount++;
    }

    if (ranCount === 0) {
      console.log(" All migrations already up to date");
    } else {
      console.log(` ${ranCount} migration(s) ran successfully`);
    }

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
};

runMigrations();
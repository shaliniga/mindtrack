import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import path from "path";

export async function runMigrations() {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const db = drizzle(pool);

  try {
    logger.info("Running database migrations...");
    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../../drizzle"),
    });
    logger.info("Database migrations completed successfully.");
  } catch (error: any) {
    logger.error(`Migration failed: ${error.message}`);
    throw error;
  } finally {
    await pool.end();
  }
}

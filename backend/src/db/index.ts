import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import * as usersSchema from "../schema/user.schema";
import * as profileSchema from "../schema/profile.schema";
import * as moodSchema from "../schema/mood.schema";
import * as alertSchema from "../schema/alert.schema";
import * as auditSchema from "../schema/audit.schema";

const schema = {
  ...usersSchema,
  ...profileSchema,
  ...moodSchema,
  ...alertSchema,
  ...auditSchema,
};

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

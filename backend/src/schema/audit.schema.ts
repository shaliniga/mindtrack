import { pgTable, uuid, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const audit_logs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actor_id: uuid("actor_id").references(() => users.id).notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  entity_id: uuid("entity_id"),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

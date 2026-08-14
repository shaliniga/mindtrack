import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { employees, managers } from "./profile.schema";

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  employee_id: uuid("employee_id").references(() => employees.id).notNull(),
  manager_id: uuid("manager_id").references(() => managers.id).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // e.g., 'mood_decline'
  severity: varchar("severity", { enum: ["low", "medium", "high"] }).notNull(),
  status: varchar("status", { enum: ["active", "resolved", "dismissed"] }).default("active").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  resolved_at: timestamp("resolved_at"),
});

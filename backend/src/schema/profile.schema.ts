import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull().unique(),
  department: varchar("department", { length: 100 }),
  job_title: varchar("job_title", { length: 100 }),
  manager_id: uuid("manager_id"), // Self-referencing to users table technically, but we don't enforce foreign key here for simplicity or we could link to managers table. Let's leave as UUID for now.
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const managers = pgTable("managers", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id).notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

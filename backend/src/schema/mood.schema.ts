import { pgTable, uuid, timestamp, integer, text, date, unique } from "drizzle-orm/pg-core";
import { employees } from "./profile.schema";
import { z } from "zod";

export const LogMoodSchema = z.object({
  mood_score: z.number().min(1).max(5),
  stress_level: z.number().min(1).max(5),
  energy_level: z.number().min(1).max(5),
  sleep_hours: z.number().min(0).max(24),
  sleep_quality: z.number().min(1).max(5),
  notes: z.string().max(500).optional(),
});

export type LogMoodInput = z.infer<typeof LogMoodSchema>;

export const mood_logs = pgTable(
  "mood_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employee_id: uuid("employee_id").references(() => employees.id).notNull(),
    log_date: date("log_date").notNull(),
    mood_score: integer("mood_score").notNull(),
    stress_level: integer("stress_level").notNull(),
    energy_level: integer("energy_level").notNull(),
    sleep_hours: integer("sleep_hours").notNull(),
    sleep_quality: integer("sleep_quality").notNull(),
    notes: text("notes"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    employeeDateIdx: unique().on(table.employee_id, table.log_date),
  })
);

import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { db } from "../../db";
import { mood_logs } from "../../schema/mood.schema";
import { employees } from "../../schema/profile.schema";
import { LogMoodInput } from "../../schema/mood.schema";
import { audit_logs } from "../../schema/audit.schema";

export const getEmployeeProfileId = async (userId: string) => {
  const employee = await db.query.employees.findFirst({
    where: eq(employees.user_id, userId),
  });
  if (!employee) throw new Error("Employee profile not found");
  return employee.id;
};

export const logMoodService = async (userId: string, data: LogMoodInput) => {
  const employeeId = await getEmployeeProfileId(userId);
  const today = new Date().toISOString().split("T")[0];

  const existingLog = await db.query.mood_logs.findFirst({
    where: and(
      eq(mood_logs.employee_id, employeeId),
      eq(mood_logs.log_date, today)
    ),
  });

  if (existingLog) {
    throw new Error("Mood already logged for today. Please update the existing entry.");
  }

  const newLog = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(mood_logs)
      .values({
        employee_id: employeeId,
        log_date: today,
        ...data,
      })
      .returning();

    await tx.insert(audit_logs).values({
      actor_id: userId,
      action: "mood_created",
      entity_id: userId, // Assuming entity is self
    });

    return inserted;
  });

  return newLog;
};

export const getTodayLogService = async (userId: string) => {
  const employeeId = await getEmployeeProfileId(userId);
  const today = new Date().toISOString().split("T")[0];

  const log = await db.query.mood_logs.findFirst({
    where: and(
      eq(mood_logs.employee_id, employeeId),
      eq(mood_logs.log_date, today)
    ),
  });

  return log || null;
};

export const updateLogService = async (userId: string, logId: string, data: LogMoodInput) => {
  const employeeId = await getEmployeeProfileId(userId);

  const existingLog = await db.query.mood_logs.findFirst({
    where: eq(mood_logs.id, logId),
  });

  if (!existingLog) {
    throw new Error("Mood log not found");
  }

  if (existingLog.employee_id !== employeeId) {
    throw new Error("Unauthorized to update this log");
  }

  const [updated] = await db
    .update(mood_logs)
    .set(data)
    .where(eq(mood_logs.id, logId))
    .returning();

  return updated;
};

export const getHistoryService = async (userId: string, from?: string, to?: string) => {
  const employeeId = await getEmployeeProfileId(userId);

  let conditions = [eq(mood_logs.employee_id, employeeId)];
  if (from) conditions.push(gte(mood_logs.log_date, from));
  if (to) conditions.push(lte(mood_logs.log_date, to));

  const history = await db
    .select()
    .from(mood_logs)
    .where(and(...conditions))
    .orderBy(desc(mood_logs.log_date));

  return history;
};

export const getStatsService = async (userId: string, days: number) => {
  const employeeId = await getEmployeeProfileId(userId);

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  const formattedDate = daysAgo.toISOString().split("T")[0];

  const stats = await db
    .select({
      date: mood_logs.log_date,
      avgMood: sql<number>`avg(${mood_logs.mood_score})`,
      avgStress: sql<number>`avg(${mood_logs.stress_level})`,
      avgEnergy: sql<number>`avg(${mood_logs.energy_level})`,
    })
    .from(mood_logs)
    .where(
      and(
        eq(mood_logs.employee_id, employeeId),
        gte(mood_logs.log_date, formattedDate)
      )
    )
    .groupBy(mood_logs.log_date)
    .orderBy(mood_logs.log_date);

  return stats.map(s => ({
    date: s.date,
    avgMood: Number(s.avgMood).toFixed(1),
    avgStress: Number(s.avgStress).toFixed(1),
    avgEnergy: Number(s.avgEnergy).toFixed(1),
  }));
};

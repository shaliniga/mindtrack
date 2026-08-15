import bcryptjs from "bcryptjs";
import { eq, sql, desc, and, gte } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../schema/user.schema";
import { employees, managers, admins } from "../../schema/profile.schema";
import { alerts } from "../../schema/alert.schema";
import { mood_logs } from "../../schema/mood.schema";
import { CreateUserInput } from "../../schema/admin.schema";
import { audit_logs } from "../../schema/audit.schema";

export const getAllUsersService = async (filters: any) => {
  // Simplistic filter implementation
  let query = db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    is_active: users.is_active,
    created_at: users.created_at,
  }).from(users);

  // Note: For a real app, apply 'filters.role' or 'filters.status' dynamically using `where`
  // We're keeping it simple for the task list.

  const allUsers = await query;
  return allUsers;
};

export const createUserService = async (data: CreateUserInput, actorId: string) => {
  const { name, email, password, role } = data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcryptjs.hash(password, 10);

  const newUser = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(users)
      .values({ name, email, password_hash: passwordHash, role })
      .returning();

    if (role === "employee") {
      await tx.insert(employees).values({ user_id: inserted.id });
    } else if (role === "manager") {
      await tx.insert(managers).values({ user_id: inserted.id });
    } else if (role === "admin") {
      await tx.insert(admins).values({ user_id: inserted.id });
    }

    await tx.insert(audit_logs).values({
      actor_id: actorId,
      action: "admin_create_user",
      entity_id: inserted.id,
    });

    return inserted;
  });

  const { password_hash, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const updateUserRoleService = async (userId: string, newRole: "employee"|"manager"|"admin", actorId: string) => {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) throw new Error("User not found");

  if (user.role === newRole) return { success: true };

  await db.transaction(async (tx) => {
    await tx.update(users).set({ role: newRole }).where(eq(users.id, userId));

    // Ensure the corresponding profile table exists
    if (newRole === "employee") {
      const exists = await tx.query.employees.findFirst({ where: eq(employees.user_id, userId) });
      if (!exists) await tx.insert(employees).values({ user_id: userId });
    } else if (newRole === "manager") {
      const exists = await tx.query.managers.findFirst({ where: eq(managers.user_id, userId) });
      if (!exists) await tx.insert(managers).values({ user_id: userId });
    } else if (newRole === "admin") {
      const exists = await tx.query.admins.findFirst({ where: eq(admins.user_id, userId) });
      if (!exists) await tx.insert(admins).values({ user_id: userId });
    }

    await tx.insert(audit_logs).values({
      actor_id: actorId,
      action: "admin_update_role",
      entity_id: userId,
      metadata: { old_role: user.role, new_role: newRole },
    });
  });

  return { success: true };
};

export const setUserStatusService = async (userId: string, isActive: boolean, actorId: string) => {
  await db.transaction(async (tx) => {
    await tx.update(users).set({ is_active: isActive }).where(eq(users.id, userId));
    await tx.insert(audit_logs).values({
      actor_id: actorId,
      action: "admin_update_status",
      entity_id: userId,
      metadata: { is_active: isActive },
    });
  });
  return { success: true };
};

export const getOrgStatsService = async () => {
  const employeesCount = await db.select({ count: sql<number>`count(*)` }).from(employees);
  
  const alertsCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(alerts)
    .where(eq(alerts.status, "active"));

  const moodStats = await db
    .select({ avgMood: sql<number>`avg(${mood_logs.mood_score})` })
    .from(mood_logs);

  // Checkins this week
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const formattedDate = sevenDaysAgo.toISOString().split("T")[0];

  const checkins = await db
    .select({ count: sql<number>`count(distinct ${mood_logs.employee_id})` })
    .from(mood_logs)
    .where(gte(mood_logs.log_date, formattedDate));

  return {
    totalEmployees: Number(employeesCount[0]?.count || 0),
    activeAlerts: Number(alertsCount[0]?.count || 0),
    orgAvgMood: Number(moodStats[0]?.avgMood || 0).toFixed(1),
    checkinsThisWeek: Number(checkins[0]?.count || 0),
  };
};

export const getOrgMoodTrendService = async (days: number) => {
  const employeesCountResult = await db.select({ count: sql<number>`count(*)` }).from(employees);
  const totalEmployees = Number(employeesCountResult[0]?.count || 1);

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  const formattedDate = daysAgo.toISOString().split("T")[0];

  const trend = await db
    .select({
      date: mood_logs.log_date,
      avgMood: sql<number>`avg(${mood_logs.mood_score})`,
      avgStress: sql<number>`avg(${mood_logs.stress_level})`,
      checkinsCount: sql<number>`count(distinct ${mood_logs.employee_id})`,
    })
    .from(mood_logs)
    .where(gte(mood_logs.log_date, formattedDate))
    .groupBy(mood_logs.log_date)
    .orderBy(mood_logs.log_date);

  return trend.map(t => ({
    date: t.date,
    avgMood: Number(t.avgMood).toFixed(1),
    avgStress: Number(t.avgStress).toFixed(1),
    checkinRate: Math.round((Number(t.checkinsCount) / totalEmployees) * 100),
  }));
};

export const getDeptBreakdownService = async () => {
  const depts = await db
    .select({
      department: employees.department,
      avgMood: sql<number>`avg(${mood_logs.mood_score})`,
      avgStress: sql<number>`avg(${mood_logs.stress_level})`,
    })
    .from(mood_logs)
    .innerJoin(employees, eq(mood_logs.employee_id, employees.id))
    .groupBy(employees.department);

  return depts.map(d => ({
    department: d.department || "Unassigned",
    avgMood: Number(d.avgMood).toFixed(1),
    avgStress: Number(d.avgStress).toFixed(1),
  }));
};

export const getProfileService = async (userId: string) => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .innerJoin(admins, eq(users.id, admins.user_id))
    .where(eq(users.id, userId));

  if (!result || result.length === 0) {
    throw new Error("Admin profile not found");
  }

  return result[0];
};

export const updateProfileService = async (userId: string, data: { name: string }) => {
  await db
    .update(users)
    .set({ name: data.name })
    .where(eq(users.id, userId));

  return await getProfileService(userId);
};

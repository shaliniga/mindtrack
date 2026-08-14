import { eq, sql, desc, inArray, gte, and } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../schema/user.schema";
import { managers, employees } from "../../schema/profile.schema";
import { mood_logs } from "../../schema/mood.schema";
import { alerts } from "../../schema/alert.schema";

export const getProfileService = async (userId: string) => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      manager_id: managers.id, // the manager's profile ID
    })
    .from(users)
    .innerJoin(managers, eq(users.id, managers.user_id))
    .where(eq(users.id, userId));

  if (!result || result.length === 0) {
    throw new Error("Manager profile not found");
  }

  return result[0];
};

// Internal helper to get manager's profile ID from user ID
export const getManagerProfileId = async (userId: string) => {
  const manager = await db.query.managers.findFirst({
    where: eq(managers.user_id, userId),
  });
  if (!manager) throw new Error("Manager profile not found");
  return manager.id;
};

export const getTeamMembersService = async (managerId: string) => {
  const managerProfileId = await getManagerProfileId(managerId);

  const team = await db
    .select({
      id: users.id,
      employee_id: employees.id,
      name: users.name,
      department: employees.department,
      job_title: employees.job_title,
    })
    .from(users)
    .innerJoin(employees, eq(users.id, employees.user_id))
    .where(eq(employees.manager_id, managerProfileId));

  // In a real app, we'd do a left join or subquery to get last log date and 7-day avg mood
  // For simplicity here, we'll return the base details.
  return team;
};

export const getTeamStatsService = async (managerId: string) => {
  const managerProfileId = await getManagerProfileId(managerId);

  // Get employee IDs for this manager
  const teamEmployees = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.manager_id, managerProfileId));

  const employeeIds = teamEmployees.map((e) => e.id);

  if (employeeIds.length === 0) {
    return {
      avgMood: 0,
      avgStress: 0,
      checkInRate: 0,
      activeAlerts: 0,
    };
  }

  // Active alerts count
  const alertsCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(alerts)
    .where(
      and(
        eq(alerts.manager_id, managerProfileId),
        eq(alerts.status, "active")
      )
    );

  // Mood and Stress Avg for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const formattedDate = sevenDaysAgo.toISOString().split("T")[0];

  const logsStats = await db
    .select({
      avgMood: sql<number>`avg(${mood_logs.mood_score})`,
      avgStress: sql<number>`avg(${mood_logs.stress_level})`,
      count: sql<number>`count(distinct ${mood_logs.employee_id})`,
    })
    .from(mood_logs)
    .where(
      and(
        inArray(mood_logs.employee_id, employeeIds),
        gte(mood_logs.log_date, formattedDate)
      )
    );

  const stats = logsStats[0] || { avgMood: 0, avgStress: 0, count: 0 };
  
  return {
    avgMood: Number(stats.avgMood || 0).toFixed(1),
    avgStress: Number(stats.avgStress || 0).toFixed(1),
    checkInRate: `${Math.round(((stats.count || 0) / employeeIds.length) * 100)}%`,
    activeAlerts: Number(alertsCount[0]?.count || 0),
  };
};

export const getTeamTrendService = async (managerId: string, days: number) => {
  const managerProfileId = await getManagerProfileId(managerId);

  const teamEmployees = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.manager_id, managerProfileId));

  const employeeIds = teamEmployees.map((e) => e.id);

  if (employeeIds.length === 0) return [];

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  const formattedDate = daysAgo.toISOString().split("T")[0];

  const trend = await db
    .select({
      date: mood_logs.log_date,
      avgMood: sql<number>`avg(${mood_logs.mood_score})`,
    })
    .from(mood_logs)
    .where(
      and(
        inArray(mood_logs.employee_id, employeeIds),
        gte(mood_logs.log_date, formattedDate)
      )
    )
    .groupBy(mood_logs.log_date)
    .orderBy(mood_logs.log_date);

  return trend.map(t => ({
    date: t.date,
    avgMood: Number(t.avgMood).toFixed(1)
  }));
};

export const getMemberDetailService = async (managerId: string, targetUserId: string) => {
  const managerProfileId = await getManagerProfileId(managerId);

  // Get target employee profile
  const employeeResult = await db
    .select({
      id: users.id,
      employee_id: employees.id,
      name: users.name,
      department: employees.department,
      job_title: employees.job_title,
      manager_id: employees.manager_id,
    })
    .from(users)
    .innerJoin(employees, eq(users.id, employees.user_id))
    .where(eq(users.id, targetUserId));

  if (!employeeResult || employeeResult.length === 0) {
    throw new Error("Employee not found");
  }

  const employee = employeeResult[0];

  if (employee.manager_id !== managerProfileId) {
    throw new Error("Unauthorized to view this employee");
  }

  // Get recent mood logs
  const logs = await db
    .select()
    .from(mood_logs)
    .where(eq(mood_logs.employee_id, employee.employee_id))
    .orderBy(desc(mood_logs.log_date))
    .limit(10);

  // Get active alerts for this employee
  const activeAlerts = await db
    .select()
    .from(alerts)
    .where(
      and(
        eq(alerts.employee_id, employee.employee_id),
        eq(alerts.status, "active")
      )
    );

  return {
    profile: employee,
    recentLogs: logs,
    activeAlerts,
  };
};

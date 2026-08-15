import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { alerts } from "../../schema/alert.schema";
import { audit_logs } from "../../schema/audit.schema";
import { getManagerProfileId } from "../manager/manager.service";

import { employees } from "../../schema/profile.schema";
import { users } from "../../schema/user.schema";

export const getAlertsService = async (userId: string, role: string) => {
  const selectQuery = db
    .select({
      id: alerts.id,
      employee_id: alerts.employee_id,
      manager_id: alerts.manager_id,
      type: alerts.type,
      severity: alerts.severity,
      status: alerts.status,
      created_at: alerts.created_at,
      resolved_at: alerts.resolved_at,
      employeeName: users.name,
    })
    .from(alerts)
    .innerJoin(employees, eq(alerts.employee_id, employees.id))
    .innerJoin(users, eq(employees.user_id, users.id));

  if (role === "admin") {
    // Admins see all alerts
    return await selectQuery;
  } else if (role === "manager") {
    // Managers see only their team's alerts
    const managerProfileId = await getManagerProfileId(userId);
    return await selectQuery.where(eq(alerts.manager_id, managerProfileId));
  } else if (role === "employee") {
    // Employees see only their own alerts
    return await selectQuery.where(eq(users.id, userId));
  } else {
    throw new Error("Unauthorized to view alerts");
  }
};

export const activeAlertExistsService = async (employeeId: string, type: string) => {
  const alert = await db.query.alerts.findFirst({
    where: and(
      eq(alerts.employee_id, employeeId),
      eq(alerts.type, type),
      eq(alerts.status, "active")
    ),
  });
  return !!alert;
};

export const createAlertService = async (employeeId: string, managerId: string, type: string, severity: "low" | "medium" | "high") => {
  const [newAlert] = await db.insert(alerts).values({
    employee_id: employeeId,
    manager_id: managerId,
    type,
    severity,
  }).returning();
  return newAlert;
};

export const resolveAlertService = async (alertId: string, actorId: string) => {
  await db.transaction(async (tx) => {
    await tx.update(alerts)
      .set({ status: "resolved", resolved_at: new Date() })
      .where(eq(alerts.id, alertId));

    await tx.insert(audit_logs).values({
      actor_id: actorId,
      action: "alert_resolved",
      entity_id: alertId,
    });
  });
  return { success: true };
};

export const dismissAlertService = async (alertId: string, actorId: string) => {
  await db.transaction(async (tx) => {
    await tx.update(alerts)
      .set({ status: "dismissed" })
      .where(eq(alerts.id, alertId));

    await tx.insert(audit_logs).values({
      actor_id: actorId,
      action: "alert_dismissed",
      entity_id: alertId,
    });
  });
  return { success: true };
};

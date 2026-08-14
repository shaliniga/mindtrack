import cron from "node-cron";
import { eq, and, gte } from "drizzle-orm";
import { db } from "../db";
import { users } from "../schema/user.schema";
import { employees } from "../schema/profile.schema";
import { mood_logs } from "../schema/mood.schema";
import { logger } from "../utils/logger";
import { activeAlertExistsService, createAlertService } from "../modules/alert/alert.service";

// Run daily at 6:00 AM
export const startAlertCheckCron = () => {
  cron.schedule("0 6 * * *", async () => {
    logger.info("Starting daily alert check cron job...");

    try {
      // 1. Get all active employees with their manager ID
      const activeEmployees = await db
        .select({
          employee_id: employees.id,
          manager_id: employees.manager_id,
          user_id: users.id,
        })
        .from(employees)
        .innerJoin(users, eq(users.id, employees.user_id))
        .where(eq(users.is_active, true));

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const formattedDate = sevenDaysAgo.toISOString().split("T")[0];

      let alertsCreated = 0;

      for (const employee of activeEmployees) {
        if (!employee.manager_id) continue; // Can't alert if no manager

        // 2. Fetch last 7 days of mood logs
        const logs = await db
          .select({ score: mood_logs.mood_score })
          .from(mood_logs)
          .where(
            and(
              eq(mood_logs.employee_id, employee.employee_id),
              gte(mood_logs.log_date, formattedDate)
            )
          );

        // 3. Skip if fewer than 3 entries
        if (logs.length < 3) continue;

        // 4. Calculate 7-day avg mood score
        const avgScore = logs.reduce((sum, log) => sum + log.score, 0) / logs.length;

        if (avgScore < 3.0) {
          // Determine severity
          let severity: "low" | "medium" | "high" = "low";
          if (avgScore < 2.0) severity = "high";
          else if (avgScore < 2.5) severity = "medium";

          // 5. Check if alert exists
          const exists = await activeAlertExistsService(employee.employee_id, "mood_decline");

          if (!exists) {
            await createAlertService(employee.employee_id, employee.manager_id, "mood_decline", severity);
            alertsCreated++;
          }
        }
      }

      logger.info(`Daily alert check finished. Created ${alertsCreated} new alerts.`);
    } catch (error: any) {
      logger.error(`Error in alert check cron: ${error.message}`);
    }
  });
};

import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../schema/user.schema";
import { employees } from "../../schema/profile.schema";
import { UpdateProfileInput } from "../../schema/employee.schema";

export const getProfileService = async (userId: string) => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      department: employees.department,
      job_title: employees.job_title,
      manager_id: employees.manager_id,
    })
    .from(users)
    .innerJoin(employees, eq(users.id, employees.user_id))
    .where(eq(users.id, userId));

  if (!result || result.length === 0) {
    throw new Error("Employee profile not found");
  }

  return result[0];
};

export const updateProfileService = async (userId: string, data: UpdateProfileInput) => {
  return await db.transaction(async (tx) => {
    // Check if employee exists
    const employee = await tx.query.employees.findFirst({
      where: eq(employees.user_id, userId),
    });

    if (!employee) {
      throw new Error("Employee profile not found");
    }

    // Update name in users table if provided
    if (data.name !== undefined) {
      await tx
        .update(users)
        .set({ name: data.name })
        .where(eq(users.id, userId));
    }

    // Update department/job_title in employees table
    const updateData: any = {};
    if (data.department !== undefined) updateData.department = data.department;
    if (data.job_title !== undefined) updateData.job_title = data.job_title;

    if (Object.keys(updateData).length > 0) {
      await tx
        .update(employees)
        .set(updateData)
        .where(eq(employees.user_id, userId));
    }

    return await getProfileService(userId);
  });
};

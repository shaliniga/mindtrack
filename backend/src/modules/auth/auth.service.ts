import bcryptjs from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../schema/user.schema";
import { employees, managers, admins } from "../../schema/profile.schema";
import { audit_logs } from "../../schema/audit.schema";
import { signToken } from "../../utils/jwt";
import { RegisterInput, LoginInput, ChangePasswordInput } from "../../schema/auth.schema";

export const registerService = async (data: RegisterInput) => {
  const { name, email, password, role } = data;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcryptjs.hash(password, 10);

  const result = await db.transaction(async (tx) => {
    // 1. Insert user
    const [newUser] = await tx
      .insert(users)
      .values({
        name,
        email,
        password_hash: passwordHash,
        role,
      })
      .returning();

    // 2. Insert role profile
    if (role === "employee") {
      await tx.insert(employees).values({ user_id: newUser.id, manager_id: data.managerId || null });
    } else if (role === "manager") {
      await tx.insert(managers).values({ user_id: newUser.id });
    } else if (role === "admin") {
      await tx.insert(admins).values({ user_id: newUser.id });
    }

    // 3. Insert audit log
    await tx.insert(audit_logs).values({
      actor_id: newUser.id, // User acting on themselves
      action: "register",
      entity_id: newUser.id,
      metadata: { role },
    });

    return newUser;
  });

  const token = signToken({ userId: result.id, role: result.role as "employee" | "manager" | "admin" });

  const { password_hash, ...userWithoutPassword } = result;
  
  return { token, user: userWithoutPassword };
};

export const loginService = async (data: LoginInput) => {
  const { email, password, role } = data;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.role !== role) {
    throw new Error("Invalid credentials or role mismatch");
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  if (!user.is_active) {
    throw new Error("Your account has been deactivated");
  }

  await db.insert(audit_logs).values({
    actor_id: user.id,
    action: "login",
    entity_id: user.id,
  });

  const token = signToken({ userId: user.id, role: user.role as "employee" | "manager" | "admin" });

  const { password_hash, ...userWithoutPassword } = user;
  
  return { token, user: userWithoutPassword };
};

export const changePasswordService = async (userId: string, data: ChangePasswordInput) => {
  const { oldPassword, newPassword } = data;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcryptjs.compare(oldPassword, user.password_hash);

  if (!isPasswordValid) {
    throw new Error("Incorrect old password");
  }

  const passwordHash = await bcryptjs.hash(newPassword, 10);

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ password_hash: passwordHash })
      .where(eq(users.id, userId));

    await tx.insert(audit_logs).values({
      actor_id: user.id,
      action: "change_password",
      entity_id: user.id,
    });
  });

  return { success: true };
};

export const getManagersService = async () => {
  const managersList = await db
    .select({
      id: managers.id,
      name: users.name,
    })
    .from(users)
    .innerJoin(managers, eq(users.id, managers.user_id))
    .where(eq(users.role, "manager"));
  return managersList;
};

import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["employee", "manager", "admin"]),
});

export const UpdateRoleSchema = z.object({
  role: z.enum(["employee", "manager", "admin"]),
});

export const UpdateStatusSchema = z.object({
  is_active: z.boolean(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

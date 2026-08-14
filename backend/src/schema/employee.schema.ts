import { z } from "zod";

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  department: z.string().max(100, "Department cannot exceed 100 characters").optional(),
  job_title: z.string().max(100, "Job title cannot exceed 100 characters").optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

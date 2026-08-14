import { Request, Response } from "express";
import { getProfileService, updateProfileService } from "./employee.service";
import { UpdateProfileSchema } from "../../schema/employee.schema";
import { sendSuccess, sendError } from "../../utils/response";

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    
    const profile = await getProfileService(req.user.userId);
    return sendSuccess(res, profile, "Profile retrieved successfully", 200);
  } catch (error: any) {
    return sendError(res, error.message, 404);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);

    const data = UpdateProfileSchema.parse(req.body);
    const updatedProfile = await updateProfileService(req.user.userId, data);
    
    return sendSuccess(res, updatedProfile, "Profile updated successfully", 200);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, error.message, 400);
  }
};

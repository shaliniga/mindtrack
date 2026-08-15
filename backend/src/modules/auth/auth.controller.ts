import { Request, Response } from "express";
import { RegisterSchema, LoginSchema, ChangePasswordSchema } from "../../schema/auth.schema";
import { registerService, loginService, changePasswordService, getManagersService } from "./auth.service";
import { sendSuccess, sendError } from "../../utils/response";
import { logger } from "../../utils/logger";

function sanitizeError(error: any): string {
  if (error.message?.startsWith("Failed query")) {
    logger.error(`Database error: ${error.message}`);
    return "Something went wrong. Please try again later.";
  }
  return error.message || "An unexpected error occurred.";
}

export const register = async (req: Request, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const result = await registerService(data);
    return sendSuccess(res, result, "Registration successful", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, sanitizeError(error), 400);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = LoginSchema.parse(req.body);
    const result = await loginService(data);
    return sendSuccess(res, result, "Login successful", 200);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, sanitizeError(error), 401);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401);
    }
    const data = ChangePasswordSchema.parse(req.body);
    const result = await changePasswordService(req.user.userId, data);
    return sendSuccess(res, result, "Password changed successfully", 200);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, sanitizeError(error), 400);
  }
};

export const getManagers = async (req: Request, res: Response) => {
  try {
    const result = await getManagersService();
    return sendSuccess(res, result, "Managers fetched successfully", 200);
  } catch (error: any) {
    return sendError(res, sanitizeError(error), 500);
  }
};

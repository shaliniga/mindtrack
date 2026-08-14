import { Request, Response } from "express";
import {
  getAllUsersService,
  createUserService,
  updateUserRoleService,
  setUserStatusService,
  getOrgStatsService,
  getOrgMoodTrendService,
  getDeptBreakdownService,
} from "./admin.service";
import { CreateUserSchema, UpdateRoleSchema, UpdateStatusSchema } from "../../schema/admin.schema";
import { sendSuccess, sendError } from "../../utils/response";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const filters = req.query; // basic filter passing
    const users = await getAllUsersService(filters);
    return sendSuccess(res, users, "Users retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const data = CreateUserSchema.parse(req.body);
    const user = await createUserService(data, req.user.userId);
    return sendSuccess(res, user, "User created successfully", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, error.message, 400);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const id = req.params.id as string;
    const data = UpdateRoleSchema.parse(req.body);
    await updateUserRoleService(id, data.role, req.user.userId);
    return sendSuccess(res, null, "User role updated successfully");
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, error.message, 400);
  }
};

export const setUserStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const id = req.params.id as string;
    const data = UpdateStatusSchema.parse(req.body);
    await setUserStatusService(id, data.is_active, req.user.userId);
    return sendSuccess(res, null, "User status updated successfully");
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, error.message, 400);
  }
};

export const getOrgStats = async (req: Request, res: Response) => {
  try {
    const stats = await getOrgStatsService();
    return sendSuccess(res, stats, "Org stats retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const getOrgMoodTrend = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trend = await getOrgMoodTrendService(days);
    return sendSuccess(res, trend, "Org mood trend retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const getDeptBreakdown = async (req: Request, res: Response) => {
  try {
    const breakdown = await getDeptBreakdownService();
    return sendSuccess(res, breakdown, "Department breakdown retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

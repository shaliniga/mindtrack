import { Request, Response } from "express";
import {
  getProfileService,
  updateProfileService,
  getTeamMembersService,
  getTeamStatsService,
  getTeamTrendService,
  getMemberDetailService,
} from "./manager.service";
import { sendSuccess, sendError } from "../../utils/response";

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const profile = await getProfileService(req.user.userId);
    return sendSuccess(res, profile, "Profile retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 404);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const { name } = req.body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return sendError(res, "Invalid profile name", 400);
    }
    const profile = await updateProfileService(req.user.userId, { name });
    return sendSuccess(res, profile, "Profile updated successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const team = await getTeamMembersService(req.user.userId);
    return sendSuccess(res, team, "Team retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const getTeamStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const stats = await getTeamStatsService(req.user.userId);
    return sendSuccess(res, stats, "Team stats retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const getTeamTrend = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const days = parseInt(req.query.days as string) || 30;
    const trend = await getTeamTrendService(req.user.userId, days);
    return sendSuccess(res, trend, "Team trend retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const getMemberDetail = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const employeeId = req.params.employeeId as string;
    const detail = await getMemberDetailService(req.user.userId, employeeId);
    return sendSuccess(res, detail, "Member detail retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 403);
  }
};

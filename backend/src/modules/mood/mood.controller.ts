import { Request, Response } from "express";
import {
  logMoodService,
  getTodayLogService,
  updateLogService,
  getHistoryService,
  getStatsService,
} from "./mood.service";
import { LogMoodSchema } from "../../schema/mood.schema";
import { sendSuccess, sendError } from "../../utils/response";

export const logMood = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const data = LogMoodSchema.parse(req.body);
    const log = await logMoodService(req.user.userId, data);
    return sendSuccess(res, log, "Mood logged successfully", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, error.message, 400);
  }
};

export const getTodayLog = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const log = await getTodayLogService(req.user.userId);
    return sendSuccess(res, log, "Today's log retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const updateLog = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const id = req.params.id as string;
    const data = LogMoodSchema.parse(req.body);
    const log = await updateLogService(req.user.userId, id, data);
    return sendSuccess(res, log, "Mood log updated successfully");
  } catch (error: any) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors);
    }
    return sendError(res, error.message, 400);
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const from = req.query.from as string;
    const to = req.query.to as string;
    const history = await getHistoryService(req.user.userId, from, to);
    return sendSuccess(res, history, "Mood history retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const days = parseInt(req.query.days as string) || 7;
    const stats = await getStatsService(req.user.userId, days);
    return sendSuccess(res, stats, "Mood stats retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

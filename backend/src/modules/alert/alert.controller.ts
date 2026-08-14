import { Request, Response } from "express";
import {
  getAlertsService,
  resolveAlertService,
  dismissAlertService,
} from "./alert.service";
import { sendSuccess, sendError } from "../../utils/response";

export const getAlerts = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const alerts = await getAlertsService(req.user.userId, req.user.role);
    return sendSuccess(res, alerts, "Alerts retrieved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const resolveAlert = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const id = req.params.id as string;
    await resolveAlertService(id, req.user.userId);
    return sendSuccess(res, null, "Alert resolved successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

export const dismissAlert = async (req: Request, res: Response) => {
  try {
    if (!req.user) return sendError(res, "Unauthorized", 401);
    const id = req.params.id as string;
    await dismissAlertService(id, req.user.userId);
    return sendSuccess(res, null, "Alert dismissed successfully");
  } catch (error: any) {
    return sendError(res, error.message, 400);
  }
};

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const requireRole = (roles: Array<"employee" | "manager" | "admin">) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "Authentication required", 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, "You do not have permission to access this resource", 403);
      return;
    }

    next();
  };
};

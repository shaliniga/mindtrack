import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    // @ts-ignore
    const reqId = req.id || "N/A";
    logger.info(`[${reqId}] ${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
  });

  next();
};

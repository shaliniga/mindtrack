import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const reqId = uuidv4();
  // @ts-ignore
  req.id = reqId; // Attach to request
  res.setHeader("X-Request-Id", reqId);
  next();
};

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { sendSuccess } from "./utils/response";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { metricsMiddleware } from "./middleware/metrics.middleware";

const app = express();

// Middlewares
app.use(requestIdMiddleware);
app.use(metricsMiddleware);
app.use(helmet());
app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.split(","),
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

import authRoutes from "./modules/auth/auth.routes";
import employeeRoutes from "./modules/employee/employee.routes";
import managerRoutes from "./modules/manager/manager.routes";
import adminRoutes from "./modules/admin/admin.routes";
import moodRoutes from "./modules/mood/mood.routes";
import alertRoutes from "./modules/alert/alert.routes";
import { setupSwagger } from "./config/swagger";
import { startAlertCheckCron } from "./jobs/alert-check.cron";

// Swagger UI (dev only)
if (env.NODE_ENV !== "production") {
  setupSwagger(app);
}

// Health Check
app.get("/health", (req: Request, res: Response) => {
  sendSuccess(res, { db: "connected" }, "Server is healthy"); 
});

import path from "path";

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/managers", managerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/mood", moodRoutes);
app.use("/api/v1/alerts", alertRoutes);

// Serve frontend static assets in production
if (env.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist));

  // Wildcard fallback to serve index.html for client-side routing
  app.get("{*path}", (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith("/api/v1") || req.path === "/health") {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Global Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  const reqId = req.id || "N/A";
  logger.error(`[${reqId}] Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  // Start the cron job
  startAlertCheckCron();
});

export default app;

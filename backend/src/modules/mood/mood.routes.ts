import { Router } from "express";
import {
  logMood,
  getTodayLog,
  updateLog,
  getHistory,
  getStats,
} from "./mood.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// Mood endpoints are for employees (though managers might log their own too if they use it, let's allow both)
// The task says "Employee Pages -> Log Mood", so we'll stick to employee for now.
router.use(authMiddleware);
router.use(requireRole(["employee"]));

/** @openapi
 * /api/v1/mood:
 *   post:
 *     tags: [Mood]
 *     security: [{ bearerAuth: [] }]
 */
router.post("/", logMood);
/** @openapi
 * /api/v1/mood/today:
 *   get:
 *     tags: [Mood]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/today", getTodayLog);
/** @openapi
 * /api/v1/mood/{id}:
 *   put:
 *     tags: [Mood]
 *     security: [{ bearerAuth: [] }]
 */
router.put("/:id", updateLog);
/** @openapi
 * /api/v1/mood/history:
 *   get:
 *     tags: [Mood]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/history", getHistory);
/** @openapi
 * /api/v1/mood/stats:
 *   get:
 *     tags: [Mood]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/stats", getStats);

export default router;

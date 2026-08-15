import { Router } from "express";
import { getAlerts, resolveAlert, dismissAlert } from "./alert.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// Alerts routing rules
router.use(authMiddleware);

/**
 * @openapi
 * /api/v1/alerts:
 *   get:
 *     summary: Get all alerts for the user's scope
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", requireRole(["employee", "manager", "admin"]), getAlerts);

/**
 * @openapi
 * /api/v1/alerts/{id}/resolve:
 *   put:
 *     summary: Resolve an alert
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put("/:id/resolve", requireRole(["manager", "admin"]), resolveAlert);

/**
 * @openapi
 * /api/v1/alerts/{id}/dismiss:
 *   put:
 *     summary: Dismiss an alert
 *     tags: [Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put("/:id/dismiss", requireRole(["manager", "admin"]), dismissAlert);

export default router;

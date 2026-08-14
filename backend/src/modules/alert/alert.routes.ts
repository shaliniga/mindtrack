import { Router } from "express";
import { getAlerts, resolveAlert, dismissAlert } from "./alert.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// Alerts are accessible by managers and admins
router.use(authMiddleware);
router.use(requireRole(["manager", "admin"]));

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
router.get("/", getAlerts);

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
router.put("/:id/resolve", resolveAlert);

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
router.put("/:id/dismiss", dismissAlert);

export default router;

import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getTeamMembers,
  getTeamStats,
  getTeamTrend,
  getMemberDetail,
} from "./manager.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// All manager routes require authentication and the 'manager' role
router.use(authMiddleware);
router.use(requireRole(["manager"]));

/** @openapi
 * /api/v1/managers/me:
 *   get:
 *     tags: [Manager]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/me", getProfile);
router.put("/me", updateProfile);
/** @openapi
 * /api/v1/managers/me/team:
 *   get:
 *     tags: [Manager]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/me/team", getTeamMembers);
/** @openapi
 * /api/v1/managers/me/team/stats:
 *   get:
 *     tags: [Manager]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/me/team/stats", getTeamStats);
/** @openapi
 * /api/v1/managers/me/team/trend:
 *   get:
 *     tags: [Manager]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/me/team/trend", getTeamTrend);
/** @openapi
 * /api/v1/managers/me/team/{employeeId}:
 *   get:
 *     tags: [Manager]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/me/team/:employeeId", getMemberDetail);

export default router;

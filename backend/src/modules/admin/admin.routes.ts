import { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateUserRole,
  setUserStatus,
  getOrgStats,
  getOrgMoodTrend,
  getDeptBreakdown,
} from "./admin.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// All admin routes require authentication and the 'admin' role
router.use(authMiddleware);
router.use(requireRole(["admin"]));

// User Management
/** @openapi
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/users", getAllUsers);
/** @openapi
 * /api/v1/admin/users:
 *   post:
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.post("/users", createUser);
/** @openapi
 * /api/v1/admin/users/{id}/role:
 *   put:
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.put("/users/:id/role", updateUserRole);
/** @openapi
 * /api/v1/admin/users/{id}/status:
 *   put:
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.put("/users/:id/status", setUserStatus);

// Analytics & Stats
/** @openapi
 * /api/v1/admin/stats:
 *   get:
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/stats", getOrgStats);
/** @openapi
 * /api/v1/admin/analytics/trend:
 *   get:
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/analytics/trend", getOrgMoodTrend);
/** @openapi
 * /api/v1/admin/analytics/departments:
 *   get:
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/analytics/departments", getDeptBreakdown);

export default router;

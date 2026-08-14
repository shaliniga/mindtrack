import { Router } from "express";
import { getProfile, updateProfile } from "./employee.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

// All employee routes require authentication and the 'employee' role
router.use(authMiddleware);
router.use(requireRole(["employee"]));

/**
 * @openapi
 * /api/v1/employees/me:
 *   get:
 *     tags: [Employee]
 *     security: [{ bearerAuth: [] }]
 */
router.get("/me", getProfile);

/**
 * @openapi
 * /api/v1/employees/me:
 *   put:
 *     tags: [Employee]
 *     security: [{ bearerAuth: [] }]
 */
router.put("/me", updateProfile);

export default router;

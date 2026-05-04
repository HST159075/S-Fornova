import { Router } from "express";
import { protect, authorize } from "../../middleware/auth.js";
import { userController } from "./user.controller.js";

const router = Router();

router.get("/", protect, authorize("ADMIN", "MANAGER"), userController.getAllUsers);
router.get("/:id", protect, authorize("ADMIN", "MANAGER"), userController.getUserById);
router.put("/:id/role", protect, authorize("ADMIN"), userController.updateUserRole);
router.put("/:id/status", protect, authorize("ADMIN"), userController.updateUserStatus);

export const userRoutes = router;

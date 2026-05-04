import { Router } from "express";
import { protect, authorize } from "../../middleware/auth.js";
import { dashboardController } from "./dashboard.controller.js";

const router = Router();

router.get("/stats", protect, authorize("ADMIN", "MANAGER"), dashboardController.getStats);

export const dashboardRoutes = router;

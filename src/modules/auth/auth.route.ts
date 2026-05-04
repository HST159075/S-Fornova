import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../lib/auth.js";
import { protect } from "../../middleware/auth.js";
import { authController } from "./auth.controller.js";

const router = Router();

// ── Better Auth handles all /api/auth/* routes ────────────
router.all("/", toNodeHandler(auth));

// ── Custom User Profile Routes ──────────────────────────────
router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, authController.updateProfile);
router.put("/address", protect, authController.updateAddress);

export const authRoutes = router;

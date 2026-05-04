import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import { cartController } from "./cart.controller.js";

const router = Router();

router.get("/", protect, cartController.getCart);
router.post("/add", protect, cartController.addToCart);
router.put("/update", protect, cartController.updateQuantity);
router.delete("/remove/:productId", protect, cartController.removeFromCart);
router.delete("/clear", protect, cartController.clearCart);

export const cartRoutes = router;

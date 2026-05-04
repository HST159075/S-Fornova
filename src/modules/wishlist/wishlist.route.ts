import { Router } from "express";
import { protect } from "../../middleware/auth.js";
import { wishlistController } from "./wishlist.controller.js";

const router = Router();

router.get("/", protect, wishlistController.getWishlist);
router.post("/toggle/:productId", protect, wishlistController.toggleWishlist);
router.delete("/clear", protect, wishlistController.clearWishlist);

export const wishlistRoutes = router;

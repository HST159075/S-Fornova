import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { reviewController } from "./review.controller.js";

const router = Router();

router.get("/product/:productId", reviewController.getReviewsByProduct);

router.post(
  "/",
  protect,
  [
    body("productId").notEmpty().withMessage("Product ID required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    body("comment").trim().notEmpty().withMessage("Comment required"),
  ],
  validate,
  reviewController.createReview
);

router.delete("/:id", protect, reviewController.deleteReview);

export const reviewRoutes = router;

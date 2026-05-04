import { Router } from "express";
import { body } from "express-validator";
import { protect, authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { categoryController } from "./category.controller.js";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  [body("name").trim().notEmpty().withMessage("Name is required")],
  validate,
  categoryController.createCategory
);

router.put("/:id", protect, authorize("ADMIN"), categoryController.updateCategory);
router.delete("/:id", protect, authorize("ADMIN"), categoryController.deleteCategory);

export const categoryRoutes = router;

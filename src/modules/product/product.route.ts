import { Router } from "express";
import { body } from "express-validator";
import { protect, authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { productController } from "./product.controller.js";

const router = Router();

router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/:id", productController.getProductById);

router.post(
  "/",
  protect,
  authorize("ADMIN", "MANAGER"),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("categoryId").notEmpty().withMessage("Category is required"),
    body("sku").trim().notEmpty().withMessage("SKU is required"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  ],
  validate,
  productController.createProduct
);

router.put("/:id", protect, authorize("ADMIN", "MANAGER"), productController.updateProduct);
router.delete("/:id", protect, authorize("ADMIN"), productController.deleteProduct);

export const productRoutes = router;

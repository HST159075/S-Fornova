import { Router } from "express";
import { body } from "express-validator";
import { protect, authorize } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { orderController } from "./order.controller.js";

const router = Router();

router.post(
  "/",
  protect,
  [
    body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
    body("items.*.productId").notEmpty().withMessage("Product ID is required"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("paymentMethod").optional().isIn(["CARD", "CASH_ON_DELIVERY", "BKASH", "NAGAD"]),
  ],
  validate,
  orderController.createOrder
);

router.get("/my", protect, orderController.getMyOrders);
router.get("/", protect, authorize("ADMIN", "MANAGER"), orderController.getAllOrders);
router.get("/:id", protect, orderController.getOrderById);
router.put("/:id/status", protect, authorize("ADMIN", "MANAGER"), orderController.updateOrderStatus);
router.put("/:id/pay", protect, authorize("ADMIN", "MANAGER"), orderController.markAsPaid);

export const orderRoutes = router;

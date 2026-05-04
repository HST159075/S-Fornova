import { Request, Response } from "express";
import { orderService } from "./order.service.js";

const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, order });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.json({ success: true, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.json({ success: true, ...result, pages: Math.ceil(result.total / result.limitNum) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: "Order not found" });
      return;
    }

    if (order.userId !== req.user.id && req.user.role === "USER") {
      res.status(403).json({ success: false, message: "Not authorized" });
      return;
    }

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body);
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const markAsPaid = async (req: Request, res: Response) => {
  try {
    const order = await orderService.markAsPaid(req.params.id, req.body.stripePaymentId);
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const orderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  markAsPaid,
};

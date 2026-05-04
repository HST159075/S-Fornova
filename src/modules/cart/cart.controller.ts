import { Request, Response } from "express";
import { cartService } from "./cart.service.js";

const getCart = async (req: Request, res: Response) => {
  try {
    const items = await cartService.getCart(req.user.id);
    res.json({ success: true, items });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const item = await cartService.addToCart(req.user.id, productId, quantity);
    res.json({ success: true, item });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateQuantity = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const result = await cartService.updateQuantity(req.user.id, productId, quantity);
    res.json({ success: true, ...(typeof result === "object" ? result : { item: result }) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeFromCart = async (req: Request, res: Response) => {
  try {
    await cartService.removeFromCart(req.user.id, req.params.productId);
    res.json({ success: true, message: "Item removed from cart" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const clearCart = async (req: Request, res: Response) => {
  try {
    await cartService.clearCart(req.user.id);
    res.json({ success: true, message: "Cart cleared" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cartController = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};

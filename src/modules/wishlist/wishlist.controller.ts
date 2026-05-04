import { Request, Response } from "express";
import { wishlistService } from "./wishlist.service.js";

const getWishlist = async (req: Request, res: Response) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id);
    res.json({ success: true, wishlist });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleWishlist = async (req: Request, res: Response) => {
  try {
    const result = await wishlistService.toggleWishlist(req.user.id, req.params.productId);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const clearWishlist = async (req: Request, res: Response) => {
  try {
    await wishlistService.clearWishlist(req.user.id);
    res.json({ success: true, message: "Wishlist cleared" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const wishlistController = {
  getWishlist,
  toggleWishlist,
  clearWishlist,
};

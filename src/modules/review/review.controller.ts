import { Request, Response } from "express";
import { reviewService } from "./review.service.js";

const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getReviewsByProduct(req.params.productId);
    res.json({ success: true, reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createReview = async (req: Request, res: Response) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json({ success: true, review });
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(400).json({ success: false, message: "You have already reviewed this product" });
      return;
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const result = await reviewService.deleteReview(req.params.id, req.user.id, req.user.role);
    res.json({ success: true, ...result });
  } catch (err: any) {
    const status = err.message === "Not authorized" ? 403 : err.message === "Review not found" ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const reviewController = {
  getReviewsByProduct,
  createReview,
  deleteReview,
};

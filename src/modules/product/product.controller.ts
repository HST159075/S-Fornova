import { Request, Response } from "express";
import { productService } from "./product.service.js";

const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await productService.getProducts(req.query);
    res.json({ success: true, ...result, pages: Math.ceil(result.total / result.limitNum) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getFeaturedProducts();
    res.json({ success: true, products });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const productController = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

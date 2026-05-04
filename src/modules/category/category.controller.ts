import { Request, Response } from "express";
import { categoryService } from "./category.service.js";

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }
    res.json({ success: true, category });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json({ success: true, category });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const categoryController = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

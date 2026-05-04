import { Request, Response } from "express";
import { authService } from "./auth.service.js";

const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateAddress = async (req: Request, res: Response) => {
  try {
    const address = await authService.updateAddress(req.user.id, req.body);
    res.json({ success: true, address });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const authController = {
  getProfile,
  updateProfile,
  updateAddress,
};

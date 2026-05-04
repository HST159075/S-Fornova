import { Request, Response } from "express";
import { userService } from "./user.service.js";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.json({ success: true, ...result, pages: Math.ceil(result.total / result.limitNum) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUserStatus(req.params.id, req.body.isActive);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
};

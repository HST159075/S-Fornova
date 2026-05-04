import { Request, Response } from "express";
import { dashboardService } from "./dashboard.service.js";

const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await dashboardService.getStats();
    res.json({ success: true, ...stats });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const dashboardController = {
  getStats,
};

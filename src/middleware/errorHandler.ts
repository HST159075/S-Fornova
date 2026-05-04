import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route not found: ${req.originalUrl}`) as any;
  err.status = 404;
  next(err);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || err.statusCode || 500;

  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return res.status(400).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found.",
    });
  }

  console.error(`[${statusCode}] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

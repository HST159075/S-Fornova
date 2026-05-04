import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import prisma from "../lib/prisma.js";

/**
 * protect — verifies Better Auth session token
 * Attaches req.user (full DB user) to the request
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Better Auth getSession expects HeadersInit, but Express provides IncomingHttpHeaders.
    // Converting Express headers to a standard Headers object fixes the type mismatch.
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
    });

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please sign in.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account not found or deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session invalid or expired.",
    });
  }
};

/**
 * authorize — role-based guard (call after protect)
 * Usage: authorize("ADMIN", "MANAGER")
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}.`,
      });
    }
    next();
  };
};

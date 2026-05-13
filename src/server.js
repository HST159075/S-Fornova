// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Route imports
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import userRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Better Auth — MUST come before express.json() ───────────
// Better Auth handles its own body parsing
app.all("/api/auth/*", toNodeHandler(auth));

// ── Body Parsers ────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "FurNova API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    auth: "Better Auth + PostgreSQL + Prisma",
  });
});

// ── API Routes ──────────────────────────────────────────────
app.use("/api/auth/extra", authRoutes);   // Custom auth endpoints (profile, address)
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ── 404 & Error Handlers ────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 FurNova API running on http://localhost:${PORT}`);
  console.log(`🔐 Auth:     Better Auth (email + Google OAuth)`);
  console.log(`🗃️  Database: PostgreSQL via Prisma ORM`);
  console.log(`📦 Env:      ${process.env.NODE_ENV || "development"}`);
  console.log(`\nRoutes:`);
  console.log(`  POST /api/auth/sign-up/email`);
  console.log(`  POST /api/auth/sign-in/email`);
  console.log(`  GET  /api/products`);
  console.log(`  GET  /api/dashboard/stats\n`);
});

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Route imports
import { authRoutes } from "./modules/auth/auth.route.js";
import { productRoutes } from "./modules/product/product.route.js";
import { categoryRoutes } from "./modules/category/category.route.js";
import { orderRoutes } from "./modules/order/order.route.js";
import { reviewRoutes } from "./modules/review/review.route.js";
import { cartRoutes } from "./modules/cart/cart.route.js";
import { wishlistRoutes } from "./modules/wishlist/wishlist.route.js";
import { userRoutes } from "./modules/user/user.route.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.route.js";

const app = express();

// ── CORS ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://c-fornuva.vercel.app",
  "http://localhost:3000"
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
  })
);

// ── Better Auth — MUST come before express.json() ───────────
app.all("/api/auth/*", toNodeHandler(auth));

app.get('/health',(req, res) => {
  res.send('Ok')
})
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
app.use("/api/auth/extra", authRoutes);
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

export default app;

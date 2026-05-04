import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

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

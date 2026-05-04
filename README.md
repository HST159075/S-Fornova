# FurNova Backend API

**Node.js + Express + Better Auth + PostgreSQL + Prisma ORM**

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js** | Runtime (ES Modules) |
| **Express.js** | HTTP framework |
| **Better Auth** | Authentication (email + Google OAuth) |
| **PostgreSQL** | Database |
| **Prisma ORM** | Type-safe DB queries + migrations |
| **Stripe** | Payment processing |
| **Zod** | Input validation |

---

## 🚀 Setup Guide

### Prerequisites
- Node.js 18+
- PostgreSQL running locally or on a cloud provider (Supabase, Railway, Neon, etc.)

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Configure environment
```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/furnova_db"
BETTER_AUTH_SECRET="any_long_random_string_at_least_32_chars"
BETTER_AUTH_URL="http://localhost:5000"
CLIENT_URL="http://localhost:3000"
```

### Step 3 — Run Prisma migrations
```bash
# Push schema to database (creates tables)
npm run db:push

# OR use migrations (recommended for production)
npm run db:migrate
```

### Step 4 — Generate Prisma Client
```bash
npm run db:generate
```

### Step 5 — Seed the database
```bash
npm run db:seed
```
Creates categories, products, and demo accounts.

### Step 6 — Start the server
```bash
# Development (hot-reload)
npm run dev

# Production
npm start
```

**Server:** `http://localhost:5000`

---

## 👤 Demo Accounts

| Role    | Email                   | Password     |
|---------|-------------------------|--------------|
| Admin   | admin@furnova.com       | admin1234    |
| Manager | manager@furnova.com     | manager1234  |
| User    | user@furnova.com        | user1234     |

---

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # DB schema (PostgreSQL)
│   └── seed.js              # Database seeder
├── src/
│   ├── lib/
│   │   ├── auth.js          # Better Auth configuration
│   │   └── prisma.js        # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.js          # Session guard + role authorize
│   │   ├── errorHandler.js  # Global error handler
│   │   └── validate.js      # express-validator helper
│   ├── routes/
│   │   ├── auth.js          # Custom profile/address endpoints
│   │   ├── products.js      # Product CRUD + filter/search/pagination
│   │   ├── categories.js    # Category CRUD
│   │   ├── orders.js        # Order management
│   │   ├── reviews.js       # Product reviews
│   │   ├── cart.js          # Shopping cart (DB-persisted)
│   │   ├── wishlist.js      # Wishlist toggle
│   │   ├── users.js         # Admin user management
│   │   └── dashboard.js     # Analytics & stats
│   └── server.js            # App entry point
├── .env.example
└── package.json
```

---

## 🔐 Authentication (Better Auth)

Better Auth automatically handles these routes at `/api/auth/*`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Register with email/password |
| POST | `/api/auth/sign-in/email` | Login with email/password |
| POST | `/api/auth/sign-out` | Sign out |
| GET | `/api/auth/session` | Get current session |
| GET | `/api/auth/sign-in/google` | Google OAuth sign-in |
| POST | `/api/auth/forget-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password |

**Custom auth routes** at `/api/auth/extra/*`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/extra/profile` | Get current user profile |
| PUT | `/api/auth/extra/profile` | Update name, phone, avatar |
| PUT | `/api/auth/extra/address` | Update shipping address |

---

## 📦 API Endpoints

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products?page=1&limit=12&search=sofa&category=id&minPrice=500&maxPrice=2000&sort=price_asc` | Public |
| GET | `/api/products/featured` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin/Manager |
| PUT | `/api/products/:id` | Admin/Manager |
| DELETE | `/api/products/:id` | Admin |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders` | Auth |
| GET | `/api/orders/my` | Auth |
| GET | `/api/orders/:id` | Auth |
| GET | `/api/orders` | Admin/Manager |
| PUT | `/api/orders/:id/status` | Admin/Manager |
| PUT | `/api/orders/:id/pay` | Admin/Manager |

### Cart
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/cart` | Auth |
| POST | `/api/cart/add` | Auth |
| PUT | `/api/cart/update` | Auth |
| DELETE | `/api/cart/remove/:productId` | Auth |
| DELETE | `/api/cart/clear` | Auth |

---

## 🛠 Useful Commands

```bash
npm run db:studio     # Open Prisma Studio (visual DB browser)
npm run db:migrate    # Create & run migration
npm run db:push       # Push schema changes without migration history
npm run db:seed       # Seed database with sample data
```

---

## 🌐 Google OAuth Setup (Optional)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add `http://localhost:5000/api/auth/callback/google` as authorized redirect URI
5. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`

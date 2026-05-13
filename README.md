# 🛋️ FurNova — Premium Full-Stack E-Commerce Ecosystem

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
</p>

**FurNova** is a modern, scalable, and high-performance **full-stack e-commerce platform** designed to deliver a premium online shopping experience. It supports **multi-role management (Admin, Manager, User)**, real-time inventory tracking, advanced analytics, and secure payment integration.

---

# ✨ Key Features

## 🛒 Customer Experience
- Premium UI/UX with smooth animations using GSAP and Framer Motion
- Persistent Cart & Wishlist synced with database
- Advanced product search, category filter, and price filtering
- Secure checkout using Stripe payment gateway
- Fully responsive for mobile, tablet, and desktop

## 🔐 Multi-Role Management

### 🛠️ Admin Dashboard
- Manage users and permissions
- Monitor revenue and analytics
- Control inventory and product listings
- Configure platform settings

### 👔 Manager Dashboard
- Manage products and categories
- Handle order processing
- Update inventory and product information

### 👤 User Dashboard
- Track order history
- Manage profile and account settings
- Maintain wishlist and saved items

---

# 📊 Advanced Analytics
- Real-time revenue and order tracking
- Interactive charts using **Recharts**
- Inventory monitoring with low-stock alerts

---

# 🛠️ Tech Stack

## Frontend
- **Framework:** Next.js 14 (TypeScript)
- **Styling:** Tailwind CSS + Lucide Icons
- **Animations:** GSAP + Framer Motion
- **State Management:** Zustand
- **Data Fetching:** Axios + TanStack Query

## Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon / Supabase)
- **ORM:** Prisma ORM
- **Authentication:** Better-Auth (Email + Social Login)
- **Validation & Security:** Zod, CORS, Express Validator

---

# 📁 Project Structure

```text
FurNova/
│
├── frontend/             # Next.js Application
│   ├── src/components/   # Reusable UI components
│   ├── src/pages/        # Routing and Page Logic
│   ├── src/store/        # Zustand State Management
│   └── src/lib/          # Utility functions
│
└── backend/              # Express API
    ├── prisma/           # DB Schema & Migrations
    ├── src/modules/      # Feature-based route modules
    └── src/lib/          # Configurations (DB, Auth)
```

---

# 🚀 Setup & Installation

## Prerequisites
- Node.js 18+
- PostgreSQL Database
- Stripe Account (API Keys)

## 1️⃣ Clone the Repository
```bash
git clone https://github.com/HST159075/FurNova.git
cd FurNova
```

## 2️⃣ Backend Setup
```bash
cd backend
npm install

cp .env.example .env
# Add DATABASE_URL, STRIPE_SECRET_KEY, BETTER_AUTH_SECRET

npm run db:push
npm run dev
```

## 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install

cp .env.local.example .env.local
# Add API URL and Stripe public key

npm run dev
```

---

# 👤 Contact
- **Developer:** Tasinul Alam
- **Email:** [hsttasin90@gmail.com](mailto:hsttasin90@gmail.com)
- **LinkedIn:** [MD Tasinul Alam](https://www.linkedin.com/in/md-tasinul-alam-28158735a/)
- **Portfolio:** [tasin-portfolio.vercel.app](https://tasin-portfolio.vercel.app)

---

# ⭐ Support
If you like this project, please give it a **star ⭐ on GitHub**.

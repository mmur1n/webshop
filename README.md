# Webshop

Full-stack e-commerce application built as a portfolio project. Features a product catalog with filtering and pagination, shopping cart with localStorage persistence, and a checkout flow with order submission.

## 🚀 Live Demo

🔗 https://webshop.murin.tech

## ✨ Features

- Product catalog with search, filtering by category/price/stock, sorting, and pagination
- Shopping cart with localStorage persistence
- Checkout flow with form validation and order submission
- 404 page and loading/error states throughout
- Responsive layout (mobile breakpoint at 768px)

## 🛠 Tech Stack

### Frontend

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript**
- **Vite**
- **Pinia** — state management
- **Vue Router**
- **SCSS** — scoped component styles + CSS custom properties design system
- **Feature-Sliced Design** — architectural pattern

### Backend

- **NestJS**
- **Prisma ORM** with driver adapter (`@prisma/adapter-pg`)
- **PostgreSQL**
- **class-validator** / **class-transformer** — DTO validation

### Shared

- **`@webshop/shared`** — internal package with shared TypeScript interfaces, enums, and constants

## 📦 Project Structure

```
webshop/
├── apps/
│   ├── frontend/        # Vue 3 SPA
│   └── backend/         # NestJS REST API
└── packages/
    └── shared/          # Shared types, enums, API contracts
```

## 🧠 Architecture Highlights

The project uses **npm workspaces** with a shared internal package `@webshop/shared` that contains API contracts used by both frontend and backend:

```ts
// packages/shared/src/types/product.contract.ts
export interface IProduct { ... }
export interface IGetProductsParams { ... }

// packages/shared/src/enum/product.enum.ts
export enum ProductSortOrder { ... }

// packages/shared/src/constants/product.ts
export const PRODUCT_PAGINATION_DEFAULTS = { PAGE: 1, LIMIT: 10 }
```

Both apps import from the same source of truth:

```ts
// apps/backend/src/products/dto/get-products.dto.ts
import {
  IGetProductsParams,
  ProductSortOrder,
  PRODUCT_PAGINATION_DEFAULTS,
} from "@webshop/shared";

// apps/frontend/src/stores/products.store.ts
import type { IProduct, IGetProductsParams } from "@webshop/shared";
```

This eliminates type duplication and prevents mismatches between frontend and backend.

## ⚙️ Local Setup

**Prerequisites:** Node.js 20+, PostgreSQL

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.development
```

Edit `apps/backend/.env` and set your PostgreSQL connection string:

```
DATABASE_URL=postgresql://user:password@localhost:5432/webshop
```

### 3. Run database migrations

```bash
npm run prisma:deploy -w backend
```

### 4. Seed database

```bash
npm run prisma:seed -w backend
```

### 5. Start development servers

```bash
# Terminal 1 — backend on http://localhost:3000
npm run dev:backend

# Terminal 2 — frontend on http://localhost:5173
npm run dev:frontend
```

## 🔐 Environment Variables

See `.env.example` files in each app directory.

| Variable       | App      | Description                  |
| -------------- | -------- | ---------------------------- |
| `DATABASE_URL` | backend  | PostgreSQL connection string |
| `FRONTEND_URL` | backend  | Frontend origin (for CORS)   |
| `VITE_API_URL` | frontend | Backend API base URL         |

## 🚀 Deployment

The project is designed to deploy as two separate services from the same repository (e.g. Railway):

**Backend service:**

```bash
# Build
npm run build:shared && npm run build:backend

# Start
npm run start:backend
```

**Frontend service:**

```bash
# Build
npm run build:shared && npm run build:frontend

# Serve (SPA mode required for Vue Router)
npx serve apps/frontend/dist -s
```

Database: PostgreSQL (e.g. Railway, Neon, Supabase)

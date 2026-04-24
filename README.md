# ShopHub Commerce Platform

Full-stack ecommerce web application for managing product discovery, cart workflows, customer accounts, and order lifecycle with a modern, scalable architecture.

## 1. Project Title & Short Tagline

**ShopHub Commerce Platform**  
Modern ecommerce storefront and admin-ready backend built with Next.js, Prisma, and PostgreSQL.

## 2. Overview

ShopHub is a production-style ecommerce project designed to deliver a smooth shopping experience for customers while providing clean backend foundations for product, order, and supplier workflows. The project combines server-rendered UI, API route handlers, and relational data modeling to support real-world commerce use cases.

**Target users:**
- Online shoppers (product browsing, cart, checkout-adjacent flows)
- Store operators/admins (catalog, orders, supplier coordination)

**Live demo:** [Add demo link](#)  
**GitHub repository:** [Add repository link](#)

## 3. Features

- Product catalog with category filtering and slug-based product pages
- Cart support for guest and authenticated users
- Account-aware order tracking and order history flows
- Database-backed order creation with stock-safe transaction logic
- Admin-oriented product and supplier API surfaces
- Newsletter/contact endpoints for customer engagement
- Reusable, component-driven UI built with shadcn/ui + Tailwind

## 4. Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI

### Backend
- Next.js Route Handlers (`/api/*`)
- Prisma ORM
- JWT/Auth utilities

### Database
- PostgreSQL
- Prisma schema + migrations

### Tools & Developer Experience
- Docker Compose (local Postgres)
- ESLint
- Prisma Studio
- Zustand + TanStack Query (state/data)

## 5. Installation & Setup

### Prerequisites
- Node.js 18+
- npm
- Docker Desktop (for local PostgreSQL)

### Setup Steps

```bash
# 1) Clone the repository
git clone <your-repo-url>

# 2) Enter project directory
cd "Internship 1"

# 3) Install dependencies
npm install
```

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shophub?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/shophub?schema=public"
JWT_SECRET="replace-with-a-strong-secret"
```

```bash
# 4) Start PostgreSQL container
npm run db:up

# 5) Sync database schema
npm run db:push

# 6) (Optional) Seed demo data
npm run db:seed

# 7) Start development server
npm run dev
```

App URL: `http://localhost:3000`  
Prisma Studio (database UI): `npm run db:studio`

## 6. Usage Instructions

1. Open `http://localhost:3000`.
2. Browse products, categories, and product detail pages.
3. Add items to cart as a guest or signed-in user.
4. Place and track orders through the available order flow pages/API.
5. Use Prisma Studio to inspect and verify data changes in tables like `products`, `orders`, `cart_items`, and `users`.

## 7. Screenshots / Demo

Add screenshots or a short walkthrough GIF to highlight key flows.

![Home Page Placeholder](./public/demo-home.png)
![Product Page Placeholder](./public/demo-product.png)
![Cart Page Placeholder](./public/demo-cart.png)

If these files do not exist yet, replace them with your actual screenshot paths.

## 8. Project Structure

```text
.
├── src/
│   ├── app/                    # App Router pages and API handlers
│   │   ├── api/                # Route handlers (products, cart, orders, etc.)
│   │   ├── admin/              # Admin-facing screens
│   │   ├── account/            # User account/order pages
│   │   └── ...
│   ├── components/             # UI and feature components
│   │   ├── home/
│   │   ├── cart/
│   │   ├── products/
│   │   └── ui/
│   ├── lib/                    # Shared services (db, auth, utilities)
│   ├── hooks/                  # Reusable React hooks
│   └── stores/                 # Zustand stores
├── prisma/
│   ├── schema.prisma           # Data models and relations
│   ├── migrations/             # Migration history
│   └── seed.ts                 # Seed script
├── database/
│   ├── migrations/
│   └── seed.js
├── docker-compose.yml          # Local PostgreSQL service
└── README.md
```

## 9. API / Key Logic Explanation

### API Design
- REST-like route handlers under `/api/*`.
- Core endpoints include products, cart, orders, auth, suppliers, and order tracking.

### Key Logic Highlights
- **Cart persistence strategy:** guest cart in local state, authenticated cart synced to DB.
- **Order safety:** order creation uses transaction-aware updates to prevent stock inconsistencies.
- **Data modeling:** Prisma relations connect users, carts, products, orders, suppliers, and notifications.

## 10. Challenges & Learnings

- Designing a schema that supports both customer flows and admin workflows required careful relation planning.
- Balancing UX speed (client interactivity) with data correctness (server validation and DB transactions) was a key architectural focus.
- Building reusable component patterns across catalog, cart, and account pages improved maintainability and development velocity.

## 11. Future Improvements

- Integrate secure payment gateway and full checkout completion
- Add role-based admin dashboard with analytics
- Implement comprehensive test coverage (unit + integration + e2e)
- Add caching/optimization for high-traffic product queries
- Improve observability with structured logs and performance tracing

## 12. Contribution Guidelines

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit changes with clear messages.
4. Run lint and ensure build passes.
5. Open a pull request describing scope, screenshots, and testing notes.

## 13. License

This project is licensed under the MIT License. Add a `LICENSE` file if not already present.

## 14. Author

**Your Name**  
[LinkedIn](https://www.linkedin.com/) | [GitHub](https://github.com/)

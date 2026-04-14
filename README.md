# Next.js Commerce Scaffold

Modern Next.js 15 + TypeScript storefront scaffold with Prisma, Tailwind CSS 4, shadcn/ui, and sample ecommerce flows (products, cart, account, checkout-adjacent pages).

## Stack
- Next.js 15 (App Router), React 19
- TypeScript 5, ESLint, Tailwind CSS 4
- Backend data layer: Next.js Route Handlers + Prisma ORM (SQLite by default)
- UI: shadcn/ui (Radix), Tailwind, Lucide icons, Framer Motion
- State/data: TanStack Query, Zustand, Axios

## Prerequisites
- Node.js 18+ and npm
- PowerShell or any shell (commands below use PowerShell)

## Quick start (development)
```powershell
cd "e:\VSCode\Internship 1"

# install dependencies
npm install

# sync schema to persistent SQLite DB and generate Prisma client
npm run db:push

# optional: seed demo data
npm run db:seed

# start dev server (Windows-safe)
npm run dev
```
Open http://localhost:3000.

## Environment
Create `.env` in the project root:
```env
DATABASE_URL="file:../database/app_database.db"
JWT_SECRET="change-this-to-a-strong-secret"
```
Notes:
- `JWT_SECRET` is required in production.
- SQLite file is persisted at `database/app_database.db` (not in-memory).
- If product seed image files are not present, the UI automatically falls back to `/placeholder-product.svg`.

## Project structure
- src/app  routes and API handlers under src/app/api
- src/components  shared UI components; src/components/ui holds shadcn/ui
- src/lib/db.ts  Prisma client
- database/connection.js  central database path/config helper
- database/migrations/  migration placeholder directory
- database/seed.js  seed runner script
- database/app_database.db  persistent SQLite database file
- prisma/schema.prisma  database schema
- prisma/seed.ts  demo seed data

## Common scripts
- npm run dev  start dev server (auto-runs `prisma db push` first)
- npm run lint  lint code
- npx next build  production compile check (cross-platform)
- npm run build  standalone build packaging (uses `cp`; best in a Unix-like shell)
- npm start  run standalone production build (after npm run build)
- npm run db:push  sync schema
- npm run db:seed  seed demo data
- npm run db:studio  open Prisma Studio DB browser

## API overview
- `GET /api/products`  list products from DB with category and parsed image arrays
- `POST /api/products`  create product
- `GET /api/products/[slug]`  product details + related products
- `PUT /api/products/[slug]`  update product
- `DELETE /api/products/[slug]`  delete product
- `GET /api/cart`  get authenticated user's cart
- `PUT /api/cart`  replace/sync authenticated user's cart
- `DELETE /api/cart`  clear authenticated user's cart
- `POST /api/orders`  create order using transaction-safe stock updates
- `POST /api/track-order`  track order via DB (`orderNumber` + `email`)

## Cart persistence
- Guest users: cart persists in local storage via Zustand.
- Signed-in users: cart also syncs to database via `/api/cart`.

## Production build notes
- `npm run build` copies assets with `cp`; on Windows use Git Bash/WSL for standalone packaging.
- `npx next build` is the safest compile verification command on any platform.

## Troubleshooting
- Port 3000 busy: stop the other process or run npx next dev -p 4000.
- Missing DB: rerun npx prisma db push and (optionally) npx tsx prisma/seed.ts.

# Next.js Commerce Scaffold

Modern Next.js 15 + TypeScript storefront scaffold with Prisma, Tailwind CSS 4, shadcn/ui, and sample ecommerce flows (products, cart, account, checkout-adjacent pages).

## Stack
- Next.js 15 (App Router), React 19
- TypeScript 5, ESLint, Tailwind CSS 4
- Prisma ORM with SQLite by default
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

# create local SQLite DB and generate Prisma client
npx prisma db push

# optional: seed demo data
npx tsx prisma/seed.ts

# start dev server (Windows-safe)
npx next dev -p 3000
```
Open http://localhost:3000.

## Environment
Create `.env` in the project root:
```env
DATABASE_URL="file:./dev.db"
```
Optional (overrides defaults used in code):
- JWT_SECRET  secret for JWT auth flows

## Project structure
- src/app  routes and API handlers under src/app/api
- src/components  shared UI components; src/components/ui holds shadcn/ui
- src/lib/db.ts  Prisma client
- prisma/schema.prisma  database schema
- prisma/seed.ts  demo seed data

## Common scripts
- npx next dev -p 3000  start dev server (preferred on Windows)
- npm run lint  lint code
- npm run build  production build (uses cp; best in a Unix-like shell)
- npm start  run standalone production build (after npm run build)
- npx prisma db push  sync schema
- npx tsx prisma/seed.ts  seed demo data

## Production build notes
- npm run build copies assets with cp; on Windows use Git Bash or replace with PowerShell equivalents before running.

## Troubleshooting
- Port 3000 busy: stop the other process or run npx next dev -p 4000.
- Missing DB: rerun npx prisma db push and (optionally) npx tsx prisma/seed.ts.

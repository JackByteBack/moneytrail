# MoneyTrail

A personal expense & budget tracker that makes logging transactions near-zero-effort.

**Tagline:** "Know where your money actually goes."

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Charts:** Recharts
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth (Email + Google OAuth)
- **Design System:** Wise (via getdesign)

## Features

- **Quick-Add Transaction** — Log expenses in under 5 seconds via floating action button
- **Auto-Categorization** — Rule-based keyword matching (e.g., "Zomato" → Food)
- **Dashboard** — Total spend, category breakdown (pie chart), 6-month trend (line chart)
- **Budgets** — Set monthly limits per category with visual progress bars
- **Transactions List** — Filter by category, date, type; search by note
- **Insights** — Month-over-month comparison, top spending categories, recurring detection

## Setup Instructions

### 1. Clone & Install

```bash
cd moneytrail
npm install
```

### 2. Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Settings → API** and copy:
   - Project URL
   - Anon Key
   - Service Role Key

### 3. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and run the contents of `supabase/migration.sql`
3. This creates all tables, RLS policies, and default categories

### 5. Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project and OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Go to **Authentication → Providers** in Supabase
5. Enable Google and paste Client ID + Secret

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, Signup pages
│   ├── (protected)/         # Dashboard, Transactions, Budgets, Insights
│   ├── api/                 # API routes
│   └── auth/callback        # OAuth callback handler
├── components/
│   ├── dashboard/           # Dashboard, Budgets, Insights content
│   ├── transactions/        # Quick-add modal, transaction list
│   └── ui/                  # Navbar
├── lib/
│   └── supabase/            # Client, server, middleware helpers
└── types/
    └── database.ts          # TypeScript interfaces
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Non-Goals for v1

- Bank/UPI auto-sync (requires Account Aggregator API)
- Multi-user/family shared accounts
- Investment or asset tracking
- Native mobile app (web-only)

## License

MIT

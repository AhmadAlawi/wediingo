# Wedding Invitations

Next.js 14 (App Router) + TypeScript + Tailwind + Prisma/PostgreSQL + Supabase (auth, storage) + Stripe.

## Setup

1. `npm install`
2. Copy `.env.example` values into `.env.local` (already scaffolded with placeholders) and fill in:
   - `DATABASE_URL` / `DIRECT_URL` — Supabase Project Settings > Database > Connection string (pooled port 6543 for `DATABASE_URL`, direct port 5432 for `DIRECT_URL`).
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Project Settings > API.
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe Dashboard.
   - `CRON_SECRET` — any random string; Vercel Cron sends it automatically as `Authorization: Bearer <CRON_SECRET>`.
3. In Supabase Auth settings, enable the Google provider and set the redirect URL to `<site>/auth/callback`.
4. `npm run db:migrate` — applies the Prisma schema.
5. `npm run db:seed` — seeds the three starter templates (floral, minimalist, traditional; floral is the fully wired one).
6. `npm run dev`.

Editor photo uploads are stored on the app server itself under `public/uploads/<cardId>/` (not Supabase Storage) — no bucket setup needed. That directory persists across deploys but isn't tracked in git; back it up separately if you care about uploaded photos surviving a server rebuild.

For local Stripe webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and use the printed signing secret as `STRIPE_WEBHOOK_SECRET`.

## Key paths

- `prisma/schema.prisma` — data model.
- `src/lib/pricing.ts` — `PRICING_TABLE` and download add-on price; edit to change pricing.
- `src/lib/card-schema.ts` — card data shape + color themes.
- `src/components/wedding-card/WeddingCardView.tsx` — shared renderer for editor preview and the public `/c/[shortId]` page.
- `src/app/api/webhooks/stripe/route.ts` — activates a card on `checkout.session.completed`.
- `src/app/api/cron/expire-cards/route.ts` + `vercel.json` — daily expiry sweep.

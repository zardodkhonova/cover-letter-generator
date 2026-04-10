# AI Cover Letter Generator

A production-ready AI-powered SaaS application that generates professional cover letters in seconds. Built with a modern dark glassmorphism UI and a full-stack architecture.

 Live Demo → Coming Soon

---

## What It Does

- Guides users through a 4-step wizard to generate a personalized cover letter
- Uses Groq AI (llama-3.1-8b-instant) to generate and refine letters server-side
- Lets users improve, shorten, expand, or get suggestions on selected text
- Saves drafts and finalized letters to the cloud per user account
- Allows users to copy or export their finished letter

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| AI | Groq API (llama-3.1-8b-instant) |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Monitoring | Sentry |
| Analytics | Vercel Analytics |
| Testing | Vitest + Playwright |
| Deployment | Vercel |

---

## Features

- 4-step guided wizard (input → generate → review → finalize)
- Server-side AI integration (API keys never exposed to browser)
- AI transform toolbar (Improve / Shorten / Expand / Suggest)
- Clerk authentication with protected routes
- Auto-saving drafts to Supabase for signed-in users
- Dashboard to view, copy, delete, and reopen saved letters
- Dark glassmorphism SaaS design
- Error monitoring with Sentry
- Fully tested with Vitest and Playwright

---

## 1) Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required keys:

```
GROQ_API_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SENTRY_DSN
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
```

---

## 2) Database Setup (Supabase)

Run the following SQL in your Supabase SQL editor:

```
db/schema.sql
```

This creates the `cover_letters` table for storing cloud drafts and saved letters.

---

## 3) Run Locally

```bash
npm install
npm run dev
```

Open: http://localhost:3000

---

## 4) Auth + Protected Routes

Middleware protects the following routes (requires login):

```
/dashboard
/api/letters/*
/api/transform
```

Users can sign in directly from the top navbar.

---

## 5) Testing

```bash
npm run test        # unit + integration (Vitest)
npm run test:e2e    # end-to-end (Playwright)
npm run build       # production build validation
```

If Playwright asks for browser binaries:

```bash
npx playwright install chromium
```

---

## 6) Deploy to Vercel

1. Push this repository to GitHub
2. Import the project on vercel.com
3. Set Root Directory to `frontend`
4. Add all environment variables from `.env.example`
5. Click Deploy

After deploying, add your Vercel URL to:
- Clerk dashboard → Domains
- Supabase dashboard → Authentication → URL Configuration

---

## Project Structure

```
src/
  app/
    api/          ← server-side API routes (generate, transform, letters)
    dashboard/    ← saved letters page
  components/     ← all UI components and screen steps
  lib/            ← AI, database, analytics helpers
  store/          ← global state (useWizardStore)
db/
  schema.sql      ← database schema
```

---

## Security

- All AI API keys are server-side only — never exposed to the browser
- User data is scoped by authenticated user ID
- Protected routes enforced via Clerk middleware
# Repository Guidelines

## Project Structure & Module Organization
- `app/` Next.js App Router (routes, server components, `app/api/*`).
- `src/components/` UI components (PascalCase), `src/lib/` backend/client helpers, `src/utils/` pure utilities, `src/hooks/`, `src/data/` static data.
- `public/` static assets, `e2e/` Playwright tests, `supabase/` SQL migrations + docs, `scripts/` maintenance tasks.
- Path alias: import via `@/*` (see `tsconfig.json`).

## Build, Test, and Development Commands
- `npm run dev` — Start local dev with Turbopack at `http://localhost:3000`.
- `npm run build` — Production build (Turbopack). Triggers `postbuild` to generate sitemap.
- `npm start` — Run the built app.
- `npm test` — Run Playwright e2e. `test:headed` (with browser), `test:ui` (runner UI). Tests auto-start the dev server (see `playwright.config.ts`).

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer explicit types on exports/public APIs.
- Indentation: 2 spaces; components in `.tsx`. Route segments in `app/` are lowercase, components PascalCase.
- Hooks `useXyz`, utilities camelCase, constants UPPER_SNAKE_CASE.
- Client components must declare `"use client"`. Prefer server components by default.
- Use Tailwind CSS (v4) utility classes; limit global CSS to `app/globals.css` and scoped files.
- Import with `@/...` rather than relative `../../` chains.

## Testing Guidelines
- Framework: Playwright (`e2e/*.spec.ts`). Keep tests independent and idempotent.
- Name tests after feature/route (e.g., `e2e/chat.spec.ts`).
- For networked flows, prefer mocks in dev (`NEXT_PUBLIC_USE_MOCK=true`).
- Add/adjust tests for critical UX (contact, chat, pricing) when changing behavior.

## Commit & Pull Request Guidelines
- Commits: Conventional style — `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:` (optional scope: `feat(chat): ...`).
- PRs: clear description, linked issues, screenshots for UI, reproduction/validation steps, env var or migration notes (`supabase/migrations/*`). If routes change, confirm sitemap via `postbuild`.

## Security & Configuration Tips
- Never commit secrets. Copy `.env.example` to `.env.local`; only expose `NEXT_PUBLIC_*` to the client. Do not surface `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- Keep SQL changes in `supabase/migrations/` with a short header comment explaining intent.

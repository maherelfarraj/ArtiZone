# AGENTS.md

## Cursor Cloud specific instructions

This repo is the **ArtiZone Spa** website — a Vite + React 19 + TypeScript SPA (with an
Express SSR + API layer in `src/server/` that only runs inside GoDaddy's "Airo"/Nomad
runtime). The `README.md` is stale boilerplate ("V8 App Template"); trust the source.

### Setup / dependencies
- Node `>=22` is required (`.npmrc` sets `engine-strict=true`). `npm install` is the only
  install step (handled by the startup update script). Package manager is **npm** (use the
  `package-lock.json`; do not introduce yarn/pnpm).

### What actually runs locally (dev surface)
- **Frontend dev server**: `npm run dev` → Vite on port **5173** (host `0.0.0.0`). This is
  the developable/runnable surface in this environment. The home page and all marketing
  pages render fully.
- Standard scripts live in `package.json`: `build`, `preview`, `test` (Vitest), `lint`
  (ESLint), `type-check` (`tsc --noEmit`), `format` (Prettier).
- `npm run test` runs Vitest; pass `--run` for a single non-watch run.

### Non-obvious caveats
- **The Express backend / `/api/*` is NOT runnable locally.** `src/server/entry.ts` only
  calls `app.listen` under `import.meta.env.PROD`, several routes import `#airo/secrets`
  (maps to `./airo-secrets/src/index.ts`, which **does not exist** in the repo — it is
  injected by the Airo runtime), and the DB layer (`src/server/db/config.ts`, marked
  immutable) reads MySQL credentials from `$NOMAD_TASK_DIR/config.json` over SSL. All of
  this is provided by the managed Airo/Nomad runtime, not reproducible in this VM.
- Because the backend isn't running in dev, the booking page's time-slot availability call
  (`GET /api/scheduling/slots`) fails and shows **"Couldn't load availability"** — this is
  expected locally and blocks advancing past the date/time step. The home page, services,
  and the first booking steps (service + date selection) all work.
- **`.env` is required for the booking page to load.** `src/lib/supabase.ts` throws at
  import time if `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing, and the booking
  page imports it. Copy `env.example` to `.env` and set those two `VITE_SUPABASE_*` vars
  (placeholder values let the page render; real Supabase project credentials are needed to
  actually persist bookings/newsletter signups, which now go directly to Supabase).
- **Known pre-existing failures (not environment issues, do not "fix" as part of setup):**
  - `npm run lint` reports many `no-undef` errors (ESLint config lacks Node/browser globals
    for `src/server/**`).
  - `npm run type-check` fails on missing `#airo/secrets` / `format-overrides-plugin` /
    `RouteObject` — all Airo-runtime/build-tooling artifacts absent from the repo.
  - `npm run test` has one failing suite (`format-overrides-plugin.test.ts`) importing a
    non-existent `format-overrides-plugin` file; the other 35 tests pass.
  - `npm run build` (Vite client build) succeeds.

## Cursor Cloud specific instructions

- This repo is a single Next.js app; standard setup/run commands are documented in `README.md` and `package.json`.
- Database-backed API checks require `.env.local`; it is gitignored. Follow the existing env documentation when a fresh Cloud VM does not already have it.
- Local API writes use the configured Supabase project, so prefer read-only checks or idempotent smoke actions unless a task explicitly needs database mutation.
- `npm run lint` currently executes but reports existing ESLint errors in the source tree; treat that as a codebase issue, not a missing-toolchain setup issue.

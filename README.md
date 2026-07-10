# VMG Painting & Remodeling LLC Website

Astro website with a Node server for `/api/*` lead endpoints and SMTP email.

> **Note (2026-07-10):** the Payload CMS app that used to live in `cms/` was
> removed from the repo (decision: deploy the website only for now). All the
> CMS integration code in `src/lib/payload.ts` and the CMS docs below remain —
> everything degrades gracefully while the `PAYLOAD_*` env vars are unset.
> To bring the CMS back, restore the folder from git history:
> `git checkout 539180a -- cms`

The website works even when the CMS is offline (forms validate, email falls
back to environment variables). When the CMS is connected, every form and
chatbot submission is also stored as a lead/chat record.

Lead emails go to `LEAD_NOTIFY_EMAIL` with a monitoring BCC to
`emarketwizdigit@gmail.com` (override with `LEAD_BCC_EMAIL`; set it to an
empty string to disable).

## Architecture

- **Payload 3 is Next.js-native**, so it runs as its own Node app in `cms/`
  (deployed as a second Hostinger web app). It cannot run inside the Astro
  runtime.
- The Astro server talks to Payload via REST using a server-only admin
  **API key** (`PAYLOAD_INTERNAL_API_URL` + `PAYLOAD_API_KEY`).
- The SMTP password is stored **AES-256-GCM encrypted** in the CMS. Both apps
  share `SMTP_ENCRYPTION_KEY` so the website can decrypt it server-side.
- Database: SQLite (file `cms/vmg-cms.db` by default via `DATABASE_URI`).
  Schema is applied by migrations (`npm start` runs `payload migrate` first).

## Commands

Website (repo root):

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # -> dist/client + dist/server
npm start              # node ./dist/server/entry.mjs
npm run optimize-images
```

CMS (`cms/`):

```bash
cd cms
npm install
npm run dev            # http://localhost:3001 (admin at /admin)
npm run build
npm start              # payload migrate && next start
```

## Running locally

1. Copy `.env.example` to `.env` (root) and `cms/.env.example` to `cms/.env`.
2. Set `PAYLOAD_SECRET` (long random string) and the same `SMTP_ENCRYPTION_KEY`
   in both files.
3. Start the CMS (`cd cms && npm run dev`), open `http://localhost:3001/admin`,
   and create the **first admin user** (Payload prompts automatically).
4. In the admin, open your user → enable **API Key** → copy it.
5. In the root `.env` set:
   - `PAYLOAD_INTERNAL_API_URL=http://localhost:3001/api`
   - `PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001`
   - `PAYLOAD_API_KEY=<the key>`
6. Start the website (`npm run dev`) and submit a form — the lead appears in
   Payload Admin → Leads.

## Hostinger deployment

### Website app (existing) — verified working settings

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Branch | main |
| Node version | 22.x |
| Root directory | `./` |
| Build command | `npm run build` |
| Output directory | `dist` |
| **Entry file** | **`server/entry.mjs`** |

Important details learned from the live deployment:

- **The entry file path is relative to the output directory**, not the repo
  root. Hostinger deploys only the contents of `dist/` to the runtime, so the
  entry is `server/entry.mjs` (NOT `dist/server/entry.mjs` — that fails the
  deployment even though the build log ends with "Complete!").
- Because the runtime receives `dist/` **without `node_modules`**, the server
  must be fully self-contained. This is handled by `vite.ssr.noExternal: true`
  in `astro.config.mjs` — do not remove it, or startup crashes with
  `ERR_MODULE_NOT_FOUND`.
- Env vars: everything in `.env.example` (`HOST=0.0.0.0`, SMTP fallback vars,
  `SMTP_ENCRYPTION_KEY`, and the three `PAYLOAD_*` values once the CMS is live).
- After each deploy, click **Clear cache**.

### CMS app (new — second web app)

- Root directory: `cms`
- Build command: `npm run build`
- Start command: `npm start` (runs migrations, then `next start`; honors `PORT`)
- Node version: 22.x
- Env vars: `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL` (the CMS's own URL,
  e.g. a `cms.` subdomain), `DATABASE_URI=file:./vmg-cms.db`,
  `SMTP_ENCRYPTION_KEY` (same value as the website app)
- Admin dashboard: `<CMS URL>/admin`
- **Note:** the SQLite database and uploaded media live on the app's disk.
  Keep Hostinger backups enabled; if the platform wipes app storage between
  deploys, switch `DATABASE_URI` to a managed Postgres database and swap the
  adapter to `@payloadcms/db-postgres`.

### Deployment troubleshooting (from real incidents)

**403 Forbidden after deploy** — Hostinger is serving `dist/` as static files
instead of running the Node server:

1. Entry file must be set to `server/entry.mjs` (a blank entry file = static mode).
2. Build command is `npm run build`, output directory `dist`.
3. Node version is 22.x and `HOST=0.0.0.0` env var is set.
4. Clear the cache after redeploying.

**"Build failed" even though the build log ends with `[build] Complete!`** —
the failure is in Hostinger's post-build startup, not the build:

1. Entry file written as `dist/server/entry.mjs`? Change it to
   `server/entry.mjs` (the path is resolved inside the output directory).
2. `vite.ssr.noExternal: true` removed from `astro.config.mjs`? Restore it —
   the runtime has no `node_modules`, so all deps must be bundled.
3. Still failing: open **View analysis** and **Runtime logs** in the panel for
   the actual startup error.

**Env var values** — avoid `$` characters in values where possible (shell
expansion can mangle them), and never use one combined "SMTP" variable; each
`SMTP_*` key must be its own variable.

## SMTP settings (graphical, in the CMS)

Payload Admin → **SMTP Settings**:

- Host / port / SSL / username / password, From name + email, Lead
  Notification Email, Reply-To, optional Test Recipient.
- The password is **encrypted (AES-256-GCM) before saving**; leaving the field
  blank on later saves keeps the existing password. Plaintext is never shown,
  stored, logged, or returned by the API.
- Click **Send Test Email** to verify: the result is written to *Last Test
  Status* / *Last Tested At* and recorded in Security Logs.
  (Endpoint: `POST <CMS URL>/api/admin/test-smtp`, admin session required.)
- `SMTP_ENCRYPTION_KEY` must be set in **both** apps or saved passwords cannot
  be decrypted.

**Priority:** the website uses CMS SMTP settings when enabled and complete;
otherwise it falls back to the `SMTP_*` environment variables. Emails go to
the *Lead Notification Email* (default `vmgpaintingnremodelingllc@gmail.com`).

## Lead capture flow

| Source | Website endpoint | Stored in CMS | Email subject |
| --- | --- | --- | --- |
| Contact page form | `POST /api/contact` | Leads | New Contact Message - VMG Painting & Remodeling |
| Free estimate forms | `POST /api/free-estimate` | Leads | New Free Estimate Request - VMG Painting & Remodeling |
| Footer quick form | `POST /api/lead` | Leads | New Website Lead - VMG Painting & Remodeling |
| Chatbot (full transcript) | `POST /api/chat` | Chats + linked Lead | New Chatbot Lead - VMG Painting & Remodeling |
| Legacy alias | `POST /api/chatbot-lead` | Leads | (same as /api/lead) |

Protection on every endpoint: server-side validation and sanitization,
honeypot + timing checks, per-IP rate limiting, and link-spam rejection.
A submission succeeds when it is **stored or emailed** — if email fails but
the lead is stored, the visitor still gets a success and the failure is
recorded in Security Logs.

## Content management

- **Pages** (Payload → Pages): published pages render at `/<slug>` with SEO
  fields, canonical URLs, and safe rich-text rendering. Unpublished = 404.
  Static routes (services, about, etc.) always take precedence.
- **Updates** (Payload → Updates): listing at `/updates`, detail at
  `/updates/<slug>`. Published only.
- **Media**: uploads with required alt text; used for featured images.
- Slugs are normalized automatically and must be unique.

## Security monitoring

- `security-logs` collection (admins only): API errors, email failures, SMTP
  test results, rate limiting, and suspicious submissions, with severity.
- Website middleware catches unhandled API errors → logs + clean JSON 500.
- Payload login brute-force protection: accounts lock for 10 minutes after
  5 failed attempts (Payload core `maxLoginAttempts`/`lockTime`).
- Nothing sensitive is ever logged: no passwords, keys, or full payloads.

## Admin documentation (inside the CMS)

Seeded on first boot (Admin → Admin Docs): **SMTP Settings Guide** and
**Hostinger Deployment & SMTP Setup**, plus a production deployment checklist
(Admin → Deployment Checklists). All admin-only.

## Environment variables

Website app: see `.env.example`. CMS app: see `cms/.env.example`.

Rules:

- Never commit `SMTP_PASS`, `SMTP_ENCRYPTION_KEY`, `PAYLOAD_SECRET`, or
  `PAYLOAD_API_KEY` to Git.
- Never prefix secrets with `ASTRO_PUBLIC_` — only public values (like
  `ASTRO_PUBLIC_SITE_URL`) may be client-visible.

## Testing after deployment

1. Open `<CMS URL>/admin`, log in, save SMTP Settings, click Send Test Email.
2. Submit `/free-estimate` and `/contact-us` forms; run the chatbot end to end.
3. Confirm emails arrive at the Lead Notification inbox.
4. Confirm the leads and chat transcript appear in Payload Admin.
5. Publish a test page in Payload → verify it renders at `/<slug>` and that
   unpublished content returns 404.
6. Check Security Logs if anything failed, and Hostinger runtime logs.

# VMG Painting & Remodeling LLC Website

Astro website for `vmgpaintingnremodelingllc.com` with native lead capture:
all pages are prerendered (static and fast), and a small Node server handles
the form/chatbot API endpoints and SMTP email notifications. No third-party
form or chatbot embeds.

## Commands

```bash
npm install          # install dependencies
npm run dev          # local dev server (http://localhost:4321)
npm run build        # production build -> dist/
npm start            # run the production server (node ./dist/server/entry.mjs)
npm run optimize-images  # regenerate responsive image variants after adding images
```

## Hostinger Deployment (requires Node — not static-only hosting)

The lead forms and chatbot submit to server endpoints, so the site must run as
a **Node.js web app**, not a plain static site:

- Repository: GitHub `main` branch
- Build command: `npm run build`
- Start command: `npm start` (runs `node ./dist/server/entry.mjs`)
- Node version: 20+ (22 recommended)
- The server reads `HOST`/`PORT` from the environment (Hostinger sets these automatically; the adapter defaults to port 4321)

If the site is ever deployed as static files only, the pages will work but
every form/chatbot submission will fail — the `/api/*` endpoints need the Node
process.

## SMTP / Lead Email Setup

All submissions (contact form, free estimate form, footer quick form, chatbot)
send a notification email to the owner inbox. Configure these environment
variables in the Hostinger panel (Web App → Environment variables):

| Variable | Example | Notes |
| --- | --- | --- |
| `SMTP_HOST` | `smtp.hostinger.com` | Your SMTP server |
| `SMTP_PORT` | `465` or `587` | 465 with `SMTP_SECURE=true`, 587 with `false` |
| `SMTP_SECURE` | `true` / `false` | TLS mode matching the port |
| `SMTP_USER` | `leads@vmgpaintingnremodelingllc.com` | SMTP login |
| `SMTP_PASS` | *(secret)* | SMTP password — never committed to Git |
| `SMTP_FROM` | `"VMG Website" <leads@...>` | Optional; defaults to `SMTP_USER` |
| `LEAD_NOTIFY_EMAIL` | `vmgpaintingnremodelingllc@gmail.com` | Where lead notifications go |

Until SMTP is configured, submissions return a friendly "temporarily
unavailable" message with the phone number — nothing breaks.

**Tip:** create a mailbox on Hostinger (free with the domain) such as
`leads@vmgpaintingnremodelingllc.com` and use its SMTP credentials
(`smtp.hostinger.com`, port 465, secure `true`).

## Where Forms Submit

| Source | Endpoint | Email subject |
| --- | --- | --- |
| Contact page form | `POST /api/contact` | New Contact Message - VMG Painting & Remodeling |
| Free estimate form (home, service pages, /free-estimate) | `POST /api/free-estimate` | New Free Estimate Request - VMG Painting & Remodeling |
| Chatbot | `POST /api/chatbot-lead` | New Chatbot Lead - VMG Painting & Remodeling |
| Footer quick form | `POST /api/chatbot-lead` | New Website Lead - VMG Painting & Remodeling |

Protection on every endpoint: server-side validation, honeypot field,
too-fast-submission check, in-memory rate limiting (5 per 10 min per IP,
15s cooldown), input sanitization, and link-spam rejection. SMTP credentials
never reach the client.

## Testing Forms Locally

1. Copy `.env.example` to `.env` and fill in SMTP values (or leave empty to
   test the "unavailable" state).
2. `npm run dev`, then submit the forms on `/contact-us` and `/free-estimate`.
3. Or test an endpoint directly:

```bash
curl -X POST http://localhost:4321/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"2535550100","email":"test@example.com","service":"Roofing","message":"Test message","contactMethod":"Email","consent":true}'
```

Expected: `{"ok":true}` with SMTP configured, or a 503 JSON error without it.

## Customizing

- **Chatbot questions/options:** edit `src/components/chatbot/ChatbotWidget.astro`
  (the `ESTIMATE_STEPS` / `QUESTION_STEPS` arrays). Dropdown options shared by
  the forms and chatbot live in `src/lib/leadOptions.ts`.
- **Footer quick form on/off:** set `footerLeadForm: true|false` in `src/data/site.ts`.
- **Services/content:** `src/data/services.ts` and `src/data/site.ts`.
- **Logo:** replace the text logo in `src/components/Header.astro` / `Footer.astro`.
- **Images:** add to `public/images/`, then run `npm run optimize-images`.

## Launch Checklist

- Configure the SMTP environment variables and send a test lead.
- Verify Washington contractor registration, bond, and insurance status with
  Washington L&I before publishing final claims.
- Confirm DNS and SSL inside Hostinger for `vmgpaintingnremodelingllc.com`.
- After each deployment, clear the Hostinger cache and spot-check the forms.

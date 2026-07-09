# VMG Painting & Remodeling LLC Website

Production-ready static Astro website for `vmgpaintingremodeling.com`.

## Commands

```bash
npm install
npm run build
npm start
```

## Hostinger Deployment

Use Hostinger static website or Git deployment settings:

- Build command: `npm run build`
- Output directory: `dist`
- Entry file: none
- Node version: 20+ recommended

Upload or deploy the contents of `dist` to the site root for `vmgpaintingremodeling.com`.

## Replacement Notes

- Logo: replace the text logo in `src/components/Header.astro` and `src/components/Footer.astro`.
- Contact form: update the Fillout embed in `src/components/FilloutContactForm.astro`.
- Free estimate form: update the Fillout embed in `src/components/FilloutEstimateForm.astro`.
- Chatbot: paste the chatbot embed/container code inside `src/components/ChatbotPlaceholder.astro`.
- Services/content: update `src/data/services.ts` and `src/data/site.ts`.
- Images: add original images to `assets/source-images/<service-folder>`, then run `npm run optimize:images`. Optimized site images live in `public/images`.

## Launch Checklist

- Verify Washington contractor registration, bond, and insurance status with Washington L&I before publishing final claims.
- Add the final logo and favicon.
- Confirm the production Fillout forms and paste the chatbot embed.
- Confirm DNS and SSL inside Hostinger for `vmgpaintingremodeling.com`.

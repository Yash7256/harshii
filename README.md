# Harshita Upadhyay — Portfolio

A React, TypeScript, and Vite portfolio for product designer Harshita Upadhyay. It includes the portfolio homepage and a contact page, and is deployed to Vercel.

## Scripts

- `npm run dev` — start the local development server.
- `npm run lint` — run Oxlint.
- `npm run build` — type-check, build the Vite site, then prerender `/` and `/contact`.
- `npm run preview` — preview the generated production build.

## SEO and prerendering

The production build prerenders the homepage and contact page into static HTML so their content is present before client JavaScript runs. The browser hydrates the generated markup.

`index.html` contains placeholders for page metadata: `__SEO_TITLE__`, `__SEO_DESCRIPTION__`, `__ROBOTS_CONTENT__`, and `__CANONICAL_URL__`. Edit the per-route title, description, and robots policy in `scripts/prerender.mjs`; the script replaces every placeholder and writes the contact page to `dist/contact/index.html`.

The homepage is indexable. The contact form uses `noindex,follow` and is intentionally omitted from `public/sitemap.xml`. Keep the sitemap and `public/robots.txt` aligned when adding indexable routes.

## Content SEO

Edit each route’s title and description in `scripts/prerender.mjs`. The services list and its short descriptions live in `src/data/services.json`; add entries there to update both the homepage cards and contact form options. Project titles, summaries, images, alt text, and Behance links live in `src/data/projects.json`; optional role, tools, timeline, and outcome fields render when verified values are added. Target phrases include “Harshita Upadhyay”, “product designer India”, “UI/UX designer portfolio”, “design system designer”, and “SaaS dashboard UI design”.

Owner details still needed before adding further claims: city, education, certifications, internship details, a public resume PDF, public email, and verified role, tools, timeline, and outcome for each project. Replace the Sedative Physio Behance profile URL with its project URL when available. Related `TODO(owner)` comments are kept in `src/App.tsx`.

## Deploy

Vercel runs `npm run build` and serves the `dist` directory. `vercel.json` configures the canonical `www` host, contact route, cache policy, and security headers. Verify production routes, metadata, sitemap, and Search Console indexing after deployment.

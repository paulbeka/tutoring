# Bekaert & Pastuszka

A compact, responsive tutoring and mentoring website for Paul Bekaert and Katarzyna Pastuszka. Built with React, TypeScript and Vite, with locally served fonts and a custom SVG mathematical illustration.

## Run locally

Requires Node.js 22.12+ or a supported newer LTS release.

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory to any static website host. There is a single page and no server or database requirement.

## Set up enquiries

Copy `.env.example` to `.env.local` and add the real tutoring email address:

```dotenv
VITE_CONTACT_EMAIL=your-real-address@example.com
```

Rebuild after changing environment variables. The enquiry form validates the visitor's inputs and opens a review dialog. With an email configured, the dialog offers a prefilled email link and a copy button. Sending takes place in the visitor's email app. Without an address, the dialog explicitly provides only a copyable enquiry and never claims a message has been sent. Form content stays in browser memory and is not persisted or submitted to a server.

`VITE_` values are public client-side configuration; never put credentials or secrets in them.

## Content

- Tutor biographies, topics and FAQs: `src/App.tsx`.
- Design, responsive layout and reduced-motion support: `src/styles.css`.
- Metadata: `index.html`.
- Photography: `public/images/`. Tutor portraits are used in the introduction, profiles and contact section; locally hosted Unsplash photos illustrate London and the learning approach. Sources and licensing are recorded in [image credits](public/images/CREDITS.md). Paul's original photo is retained alongside a compressed portrait crop; the website loads only the smaller version.
- No specific universities, employers, rates, testimonials or placement claims have been invented. Add confirmed details when available.

## Accessibility

Semantic landmarks, a skip link, visible keyboard focus, labelled fields, native disclosure controls, reduced-motion support and a native modal dialog with focus containment and Escape handling.

## Checks

```sh
npm run typecheck
npm test
```

The Playwright checks use an installed Google Chrome in an isolated, headless session. They cover navigation, topic selection, FAQs, form validation, enquiry copying, modal keyboard behaviour, responsive overflow and automated WCAG AA checks. Review screenshots are written to the ignored `.qa` directory.

For another test environment, adjust `channel` in `playwright.config.ts` or install Chrome with `npx playwright install chrome`.

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

The existing form sends directly from the browser to Web3Forms. No application backend, SMTP server or database is needed.

1. Create a free form at https://app.web3forms.com/ and verify the recipient email.
2. Copy `.env.example` to `.env.local` (or use your existing `.env`) and set the form's public access key:

```dotenv
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-form-access-key
```

3. In that form's Web3Forms dashboard, enable **hCaptcha** under the spam-protection settings. This is required to enforce verification on the service side, not just in the browser. The site uses Web3Forms' shared free-plan hCaptcha site key; you do not need a separate hCaptcha account. See the [official setup guide](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha).
4. Set the same `VITE_WEB3FORMS_ACCESS_KEY` in your hosting provider's **build environment** and rebuild/redeploy. For a manual deployment, build locally with the key configured and upload `dist`. Restart the local development server after editing environment files. An existing `.env.local` overrides `.env`.
5. Test on the deployed HTTPS website: complete the CAPTCHA, send one clearly labelled test enquiry, confirm it arrives in the correct inbox (including spam), and verify that replying addresses the visitor. Automated tests use fake keys and mock delivery; they do not establish actual inbox delivery.

The form validates fields, blocks duplicate clicks, waits for an explicit successful service response and clears fields only after acceptance. Failed or timed-out requests preserve the visitor's message. CAPTCHA tokens are reset after each request. A timeout cannot establish whether the service accepted a request, so the error explains that retrying may duplicate it. Missing configuration disables sending with an unavailable message.

`VITE_` values are public client-side configuration. Web3Forms explicitly designs its form access key for browser use; never put email passwords or secret email API credentials in it. `.env` and `.env.local` are ignored by Git. The old `VITE_CONTACT_EMAIL` setting is no longer used.

Submissions are processed by Web3Forms and human verification by hCaptcha; links to their privacy information appear below the form. Review the Web3Forms dashboard's data-retention setting for your needs. The [free plan](https://web3forms.com/pricing) currently allows 250 submissions/month and one recipient per form. It stops accepting submissions after the allowance is exceeded until reset or upgrade. Use a shared inbox or inbox forwarding if both tutors need copies.

## Content

- Tutor biographies, topics and FAQs: `src/App.tsx`.
- Design, responsive layout and reduced-motion support: `src/styles.css`.
- Metadata: `index.html`.
- Photography: `public/images/`. Tutor portraits are used in the introduction, profiles and contact section; locally hosted Unsplash photos illustrate London and the learning approach. Sources and licensing are recorded in [image credits](public/images/CREDITS.md). Paul's original photo is retained alongside a compressed portrait crop; the website loads only the smaller version.
- No specific universities, employers, rates, testimonials or placement claims have been invented. Add confirmed details when available.

## Accessibility

Semantic landmarks, a skip link, visible keyboard focus, labelled fields, native disclosure controls, reduced-motion support and accessible form status/error announcements. The compact CAPTCHA fits narrow mobile layouts.

## Checks

```sh
npm run typecheck
npm test
```

The Playwright checks use an installed Google Chrome in an isolated, headless session and a dedicated development server on port 5175 with a dummy form key. Both CAPTCHA and Web3Forms are mocked, and unmatched delivery requests are blocked. They cover navigation, topic selection, FAQs, required fields, CAPTCHA expiry/errors, request contents, duplicate-submit prevention, successful acceptance, service/network/timeout failures, retries, missing configuration, responsive overflow and automated WCAG AA checks. Review screenshots are written to the ignored `.qa` directory. Third-party CAPTCHA accessibility and actual inbox delivery require a live manual check.

For another test environment, adjust `channel` in `playwright.config.ts` or install Chrome with `npx playwright install chrome`.

# Nevian — Marketing Site

A standalone, static marketing/landing site for **Nevian**, built to be hosted on
GitHub Pages at **nevian.info**. It is fully independent of the desk agent and web
dashboard — it only borrows their visual design language (emerald accents, hairline
borders, glass segmented controls, pulsing live dots) re-themed with rounded corners
and rem-based sizing for responsiveness.

## Stack

- Static HTML + CSS + a small vanilla JS file. No build step required.
- **Tailwind CSS** via the Play CDN, configured with the same color tokens as the
  web-dashboard (`tailwind.config.js`) so utility classes map to CSS variables.
- A custom `css/styles.css` design system ported from the dashboard `theme.css`.
- Light/Dark theme toggle (persisted to `localStorage`), applied before first paint.

## File layout

```
website/
  index.html            the full landing page
  CNAME                 custom domain for GitHub Pages (nevian.info)
  .nojekyll             tell GitHub Pages to serve files as-is
  css/styles.css        design tokens + ported components (rem + rounded)
  js/main.js            theme toggle, mobile nav, scroll reveal, seg control, contact form
  assets/
    logo.svg            inline brand mark (currentColor)
    favicon.svg         favicon
    dashboard-preview.png  real admin dashboard screenshot used in the page
```

## Contact form

The form is wired for **Formspree** so it works without a backend on GitHub Pages.

1. Create a free form at <https://formspree.io> (use the `hello@nevian.info` inbox).
2. In `index.html`, find the `#contact-form` and replace `YOUR_FORM_ID` in the
   `action="https://formspree.io/f/YOUR_FORM_ID"` attribute with your real form id.

Until a form id is set, the **Send Request** button falls back to opening the
visitor's email client with the message pre-filled to `hello@nevian.info`.

## Publish to GitHub Pages (nevian.info)

1. Push this `website/` content to a repository. The simplest setup is to put these
   files at the **root** of a repo (e.g. `nevian-site`). If you keep them in a
   subfolder, point Pages at that folder or use a Pages build action.
2. In the repo: **Settings → Pages**.
   - **Source:** Deploy from a branch.
   - **Branch:** `main` and the folder containing `index.html` (`/root` or `/website`).
3. Under **Custom domain**, enter `nevian.info`. The included `CNAME` file already
   sets this; GitHub will verify it.
4. Configure DNS at your domain registrar:
   - **Apex (`nevian.info`)** — add four `A` records to GitHub Pages:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - (Optional) **`www`** — add a `CNAME` record pointing to `<your-user>.github.io`.
5. Wait for DNS to propagate, then enable **Enforce HTTPS** in the Pages settings.

## Local preview

Just open `index.html` in a browser, or serve the folder:

```bash
# Python
python -m http.server 8080
# then visit http://localhost:8080
```

## Customizing

- **Colors / theme:** edit the CSS variables at the top of `css/styles.css`
  (`:root` for light, `[data-theme="dark"]` for dark).
- **Copy:** all text lives directly in `index.html`, section by section.
- **Email address:** replace `hello@nevian.info` in `index.html` and `js/main.js`
  if you use a different inbox.

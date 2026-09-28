# Nevian contact form (Google Workspace)

Replaces the old AWS path (`API Gateway → Lambda → SES`). The marketing site
is static GitHub Pages, so the browser still cannot talk SMTP. This Apps Script
web app is the Workspace equivalent: the form POSTs JSON, and Gmail sends it
into `contact@nevian.info` with the visitor as Reply-To.

Workspace SMTP relay (`smtp-relay.gmail.com`) is closer to SES on paper, but
it still needs a server. Skip it unless you bring Lambda/Cloud Functions back.

## Deploy

1. Sign in to Google as **contact@nevian.info**.
2. Open [script.google.com](https://script.google.com) → New project.
3. Paste `Code.gs`, then Deploy → New deployment → Web app:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize Gmail when Google asks.
5. Copy the `/exec` URL.

Locally, put it in `website/.env.local`:

```
VITE_CONTACT_ENDPOINT=https://script.google.com/macros/s/…/exec
```

Restart `npm run dev`. Production: GitHub repo **Settings → Secrets and
variables → Actions** → add `CONTACT_ENDPOINT` with the same URL. The Pages
workflow injects it at build time.

Redeploy the web app after any `Code.gs` change (Manage deployments → pencil
→ New version).

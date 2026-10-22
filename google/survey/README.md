# Nevian survey (Google Sheets)

Backend for `nevian.info/survey`. The site is static GitHub Pages, so it can't
write a CSV itself. This Apps Script appends each answer as a row in a Google
Sheet instead; **File → Download → Comma-separated values** gives you the CSV.

Stored per answer: timestamp, language, team size, one `0/1` column per pain
option, the "something else" text and the optional free-text wish. No names,
emails or IP addresses.

## Deploy

1. Create a new Google Sheet (e.g. "Nevian survey").
2. **Extensions → Apps Script**, replace the default code with `Code.gs`, save.
3. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize when Google asks, then copy the `/exec` URL.
5. Optional: in the editor pick `setupSummary` and click **Run** to add a
   "Summary" tab with live counts and percentages for the results post.

Locally, add to `website/.env.local` and restart `npm run dev`:

```
VITE_SURVEY_ENDPOINT=https://script.google.com/macros/s/…/exec
```

Production: GitHub repo **Settings → Secrets and variables → Actions** → add
`SURVEY_ENDPOINT` with the same URL. The Pages workflow injects it at build time.

Redeploy after any `Code.gs` change (Manage deployments → pencil → New version),
so the URL stays the same.

# Morton Lawn Co Website

Static site files:
- `index.html`
- `styles.css`
- `script.js`
- `assets/`

The form POSTs to:

`/api/schedule-request`

Expected behavior:
- Sends email to `schedule@mortonlawns.com`
- Subject: `Schedule Request: {Person’s full name}`
- Body: all form details

## Email backend

Included: Cloudflare Worker using Resend.

Deploy notes:
1. Verify `mortonlawns.com` in Resend.
2. Create a Resend API key.
3. In `cloudflare-worker/`, run:
   `wrangler secret put RESEND_API_KEY`
4. Deploy:
   `wrangler deploy`
5. Route `/api/schedule-request` to the Worker, or serve the full site behind the Worker.

## Important

A browser-only static HTML site cannot directly send an email securely without exposing credentials or depending on the user's email app. Use a backend/API route such as the included Worker.

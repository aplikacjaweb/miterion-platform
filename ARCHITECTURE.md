# Miterion — Architecture Notes

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **next-intl 3.5** — i18n routing and translations
- **Supabase** — database, storage, caching
- **Resend** — transactional email
- **puppeteer-core + @sparticuz/chromium-min** — server-side PDF generation

---

## Routing

```
/              → redirects to /en (middleware)
/en            → English home (default locale)
/pl            → Polish home
/en/privacy    → Privacy Policy
/en/terms      → Terms of Service
/en/cookies    → Cookie Policy
/pl/privacy    → Polish Privacy Policy
(same pattern for /pl/terms, /pl/cookies)

/api/fetch-trials    → POST: fetch ClinicalTrials.gov data
/api/generate-pdf    → POST: generate PDF snapshot report
/api/rfp-submit      → POST: submit RFP harmonization request
/api/upload-url      → GET:  get signed Supabase Storage upload URL
/api/dct-waitlist    → POST: join DCT Dashboard waitlist
```

All locale routes use `localePrefix: 'always'` — every URL has an explicit
`/en` or `/pl` prefix. No implicit rewriting.

---

## i18n Layout Pattern

This project uses the standard **next-intl nested layout pattern**:

```
src/app/layout.tsx           ← minimal pass-through (required by Next.js)
src/app/[locale]/layout.tsx  ← renders <html lang={locale}> and <body>
```

`<html>` and `<body>` live in the `[locale]` layout — not the root layout —
because the `lang` attribute must be dynamic per locale.
This is intentional and documented by next-intl. It is not a hack.

**Do not move `<html>/<body>` to the root layout** — doing so would break
the dynamic `lang` attribute.

### i18n files

```
src/i18n/routing.ts   ← locales array, defaultLocale, navigation helpers
                         (Link, usePathname, useRouter, redirect)
src/i18n/request.ts   ← getRequestConfig (server-only, used by next-intl plugin)
middleware.ts         ← next-intl middleware, imports from routing.ts
```

`routing.ts` is imported by client components and middleware.
`request.ts` is server-only — never import it in client code or middleware.

---

## Snapshot Pipeline

```
User fills SnapshotForm (indication, phase, geo)
  → POST /api/fetch-trials
      → check Supabase api_cache table
      → if miss: fetch ClinicalTrials.gov /v2/studies
      → cache result
      → return preview metrics to client

User enters email → clicks "Generate PDF Report"
  → POST /api/generate-pdf
      → generate HTML from pdfTemplate.ts
      → puppeteer renders HTML → PDF bytes
      → upload PDF to Supabase Storage (snapshots bucket)
      → insert row into leads_snapshot table
      → return public download URL
```

---

## RFP Pipeline

```
User fills RfpForm (email, company, message, file)
  → GET /api/upload-url?filename=...&type=...
      → generate signed Supabase Storage upload URL
  → PUT signed URL (file upload directly to storage)
  → POST /api/rfp-submit
      → insert leads_rfp row
      → insert uploads row (file_path reference)
      → send Resend email to sales@miterion.com
      → (on email failure) queue in email_queue table
```

---

## Supabase Tables Required

| Table | Purpose |
|---|---|
| `api_cache` | Caches ClinicalTrials.gov responses by indication+phase+geo |
| `leads_snapshot` | Snapshot report leads (email, company, indication, phase, geo, pdf_path) |
| `leads_rfp` | RFP harmonization leads (email, company, message) |
| `leads_dct` | DCT waitlist emails |
| `uploads` | File upload references linked to leads_rfp |
| `email_queue` | Failed email retry queue |

## Supabase Storage Buckets Required

| Bucket | Purpose |
|---|---|
| `snapshots` | Generated PDF snapshot reports (public read) |
| `rfp-uploads` | Uploaded RFP/questionnaire files |

---

## PDF Generation — Deployment Note

`puppeteer-core + @sparticuz/chromium-min` works on Vercel with the correct
configuration but has constraints:

- Max execution time ~60s (use Vercel Pro for longer)
- Set `CHROMIUM_EXECUTABLE_PATH` env var if running on a custom server
- On Vercel, `@sparticuz/chromium-min` downloads the binary to `/tmp` at runtime
- Cold starts will be slow (~5–10s) due to Chromium launch time
- Consider moving PDF generation to a background job / queue for production

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@miterion.com   # must be a verified sender domain

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: custom Chromium path for non-Vercel deployments
CHROMIUM_EXECUTABLE_PATH=/path/to/chromium
```

The app starts and renders without Supabase/Resend credentials — database
and email features degrade gracefully with console warnings.

---

## API Response Shapes

All API routes use a shared contract from `src/lib/apiResponse.ts`:

```ts
// Error
{ error: true, code: ApiErrorCode, message: string }

// Success
{ error: false, data: T }
```

Use `unwrapApi(res, json)` on the client to extract `data` or throw with the
server's `message`. This eliminates duplicated `!res.ok || json.error` checks.

### Documented exception: `fetch-trials`

`POST /api/fetch-trials` returns `FetchTrialsResponse` directly — not wrapped
in `{ error: false, data: ... }`. Reason: `FetchTrialsResponse` is itself a
discriminated union with `{ error: true/false }` at the top level (domain error,
not transport error). Wrapping it would produce ugly double-nesting.

The SnapshotForm handles this explicitly — it checks `res.ok` for transport
errors, then reads `json.error` for domain errors.

**Do not "fix" fetch-trials to use apiSuccess()** — it would break SnapshotForm.

---

## Partial Failure Behaviours

These are known, documented partial states — not bugs:

### RFP upload pipeline

| Step fails | What happens |
|---|---|
| `leads_rfp` insert fails | File is deleted from storage (rollback) |
| `uploads` link insert fails | Lead is saved, file is retained, link is missing. Log: `uploads link failed for lead X / file Y`. Can be re-linked manually. |
| Email send fails | Lead + file are saved. Notification queued in `email_queue`. |

### Snapshot PDF pipeline

| Step fails | What happens |
|---|---|
| Chromium launch fails | 500, no cleanup needed |
| PDF render fails | 500 (or 504 on timeout), no cleanup needed |
| Storage upload fails | 500, no cleanup needed (upload failed, nothing in storage) |
| `leads_snapshot` insert fails | Non-fatal. PDF is still returned to user. Error logged. |

# MITERION PLATFORM — COMPLETE MVP FIXES - TODO

## Overall Goal:
Transform the Miterion platform into a lead engine and analytics demo for clinical trial intelligence consulting, adhering to the FREE SNAPSHOT → LEAD CAPTURE → PAID INTELLIGENCE flow.

## 1. REMOVE POLISH LANGUAGE
- [ ] Delete `next-intl` related dependencies from `package.json`.
- [ ] Remove `locale routing` configuration.
- [ ] Delete `/messages/pl.json`.
- [ ] Delete routes `/[locale]` and replace with `/app/page.tsx` (ensure root page is handled correctly).
- [ ] Remove `PL / EN switcher` from UI components.
- [ ] Remove `locale middleware`.
- [ ] Verify all text content is English only across the application.

## 2. SIMPLIFY ROUTING STRUCTURE
- [ ] Ensure only `/`, `/privacy`, `/terms`, `/cookies` are the final pages.
- [ ] Update navigation links to reflect new routing.

## 3. SNAPSHOT FORM IMPROVEMENTS
- [ ] Modify `SnapshotForm` to include: `Indication (autocomplete)`, `Phase (select)`, `Country (autocomplete)`, `Email`, `Company (optional)`, `What decision are you trying to make? (optional)`.
- [ ] Implement `Indication` field with autocomplete (dataset from `clinicaltrials_conditions.json`, min 2 chars, max 10 suggestions, no free text). Store `indication_name`.
- [ ] Implement `Country` field with autocomplete (dataset from `iso_countries.json`). Store `country_name` and `country_code`.
- [ ] Implement `Phase` select with options: `All`, `Phase 1`, `Phase 2`, `Phase 3`, `Phase 4`.
- [ ] Implement `User question` optional text field with placeholder: `What decision are you trying to make? Example: site selection, protocol feasibility, recruitment risk`.

## 4. SNAPSHOT REPORT CONTENT
- [ ] **PDF Structure (MANDATORY):**
    - [ ] Maximum length: 3–5 pages.
    - [ ] Sections: 1 Snapshot overview, 2 Trial landscape table, 3 Country and sponsor distribution, 4 Key insight (one sentence).
    - [ ] The report must NOT include full trial listings or raw API dumps.
    - [ ] No AI summarization is required; all insights should be generated using simple deterministic rules.
- [ ] Implement `Landscape` section in the report: `Total trials`, `Recruiting trials`, `Top sponsors`.
- [ ] Implement `Recruitment Competition Indicator` logic: `0–3 trials → LOW`, `4–10 trials → MEDIUM`, `>10 trials → HIGH`. Display results clearly (e.g., `Recruitment Competition: HIGH`).
- [ ] Implement `Country Distribution`: Top countries by trial count.
- [ ] Implement `Key Insight` generation (single sentence summary using O-C-R framework in internal LLM prompt, using deterministic rules).
- [ ] Handle zero-result queries by displaying a 'No data found' message instead of generating a PDF.
- [ ] Add mandatory footer to PDF: 'Decision-support tool only. Public data source. Miterion assumes no liability.'

## 5. LEAD CAPTURE DATABASE
- [ ] Create `leads` table in Supabase (if not exists) with columns: `id`, `email`, `company`, `indication`, `country`, `phase`, `user_question`, `created_at`.
- [ ] Insert lead into `leads` table on the PDF generation step.

## 6. PDF GENERATION FLOW
- [ ] Ensure existing flow: `User generates preview → User enters email → POST /api/generate-pdf → PDF generated → Upload to Supabase Storage → Signed URL returned → Email sent`.
- [ ] Configure Puppeteer for Vercel: use `puppeteer-core` and `@sparticuz/chromium-min` with the specified launch configuration.
- [ ] Store PDF in `reports` Supabase bucket.

## 7. RFP REQUEST FLOW
- [ ] Keep existing feature.
- [ ] Simplify UI for "Request Full Trial Intelligence Report" button.
- [ ] Ensure form fields: `email`, `company`, `message`, `file upload`.
- [ ] Endpoints remain: `/api/upload-url`, `/api/rfp-submit`.
- [ ] Storage bucket remains: `rfp_uploads`.

## 8. DCT DASHBOARD WAITLIST
- [ ] Add section title: "DCT Operations Dashboard - Coming Soon".
- [ ] Implement form with `email` field.
- [ ] Endpoint: `POST /api/dct-waitlist`.
- [ ] Create `dct_waitlist` table in Supabase with `email` and `created_at`.

## 9. ADD HUMAN CONTACT OPTIONS
- [ ] After snapshot generation, show three actions: `Download Snapshot Report`, `Book a 15-minute call`, `Request Full Intelligence Report`.
- [ ] Implement "Book a 15-minute call" button with Calendly link: `https://calendly.com/miterion/15min`.
- [ ] Integrate external chat widget (Crisp or Tawk.to) globally.

## 10. RESPONSIVE DESIGN FIXES
- [ ] Make landing page responsive for mobile, tablet, desktop.
- [ ] Ensure responsive layout for `Hero section`, `Value proposition cards`, `Snapshot form`, `Preview metrics`, `CTA buttons`, `Footer`.
- [ ] Rules: form stacked on mobile, 2-column on tablet, full layout on desktop.

## 11. AUTOCOMPLETE DATASETS
- [ ] Use local datasets: `clinicaltrials_conditions.json` for indications and `iso_countries.json` for countries.
- [ ] Implement client-side fuzzy search with max 10 suggestions.
- [ ] No external API calls during typing for autocomplete.

## 12. SUPABASE CONFIGURATION
- [ ] Verify environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Ensure graceful error handling if environment variables are missing (e.g., "Storage service not configured").
- [ ] Client components must only use `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` must only be used inside API routes.

## 13. EMAIL DELIVERY
- [ ] Use `Resend`.
- [ ] Verify environment variables: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
- [ ] Ensure graceful error handling if Resend environment variables are missing (e.g., "Email service unavailable").
- [ ] Ensure email contains: `PDF download link`, `short thank-you message`, `upsell message`.

## 14. DEPLOYMENT RULES (Vercel Compatibility - MANDATORY)
- [ ] All API routes (`/api/fetch-trials`, `/api/generate-pdf`, `/api/upload-url`, `/api/rfp-submit`, `/api/dct-waitlist`) must explicitly define `export const runtime = "nodejs";`.
- [ ] Client components must *never* import Node.js libraries (`fs`, `path`, `puppeteer`, `supabase service role`). These must only appear inside API routes or server utilities.
- [ ] ClinicalTrials API calls must *only* happen in `/api/fetch-trials` and never in React components. Client must call `POST /api/fetch-trials`.
- [ ] Every API route must return a structured JSON response for errors (e.g., `{ error: true, message: "..." }`). Avoid uncaught exceptions or undefined responses.
- [ ] Implement timeout protection for external API calls (e.g., `signal: AbortSignal.timeout(10000)`).
- [ ] Avoid heavy dependencies that bundle Chromium or require native builds (confirm `puppeteer-core` and `@sparticuz/chromium-min` are used for PDF).
- [ ] Deployment flow: GitHub → Vercel (automatic deployment after configuration).

---
### Risks:
- Breaking existing functionality due to significant structural changes (especially routing and language).
- **Vercel deployment failures due to incorrect runtime configuration or incompatible dependencies (Puppeteer, Node.js modules in client code).**
- Issues with Puppeteer PDF generation if Vercel-safe configuration is not strictly adhered to.
- Data integrity issues with Supabase inserts, especially with new lead capture.
- Styling conflicts with Tailwind during responsive design fixes.
- Ensuring client-side fuzzy search for autocomplete is efficient and responsive.
- **Graceful error handling for all API routes and missing environment variables.**

### Validation:
- Local `npm run build` and dev server checks (`npm dev`).
- **Manual testing of all API routes to ensure `runtime="nodejs"` is respected and error handling is structured.**
- Manual testing of all user flows (snapshot generation, lead capture, RFP, waitlist, call booking).
- Visual inspection of responsive design across breakpoints.
- Checking Supabase tables for correct data insertion.
- Verifying email delivery with PDF links and upsell messages.
- **Deployment to a Vercel staging environment to confirm full compatibility and absence of runtime crashes.**

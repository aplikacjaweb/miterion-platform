# MEMORY.md

## 2026-06-14 - Cal.com Floating Widget Implementation

**Task:** Integrated Cal.com scheduling widget as a floating button in the bottom-right corner of the Miterion platform.

**Implementation Details:**
1. **Package Installation:** Added `@calcom/embed-react` package to the project dependencies.
2. **Component Creation:** Created `src/components/FloatingCalWidget.tsx` with:
   - Client-side rendering (`'use client'`)
   - Cal.com API initialization in `useEffect`
   - Configuration for light theme with black branding
   - Month view layout with hidden event details
   - Floating button positioned bottom-right
   - CalLink set to "web-app-xkqbra"

3. **Global Integration:** Added `<FloatingCalWidget />` to `src/app/layout.tsx` just before `</body>` to ensure it appears on all pages without blocking main content rendering.

**Security Compliance:**
- No modifications to existing business logic or API calls
- Widget completely isolated from local states and forms
- Preserved all existing functionality in `SnapshotForm.tsx` and other components

**User Checklist:** Created `CAL_COM_CHECKLIST.md` with step-by-step instructions for:
- RODO/GDPR privacy policy consent setup
- Minimum notice time (2 hours)
- Buffer time (15 minutes)
- Availability and email notification settings

**Verification:** Widget should now appear as a floating button on all pages, opening a modal with the Cal.com scheduling interface when clicked.

## 2026-04-04 - Production Bug Fix: "Unexpected end of JSON input" in Next.js RFP Form

**Issue:** Users were seeing "Unexpected end of JSON input" when uploading a PDF and submitting an RFP form in a Next.js application.

**Root Cause:** The frontend's `unwrapApi` helper (and direct `res.json()` calls) implicitly assumed all API responses would be valid JSON. When an API endpoint (or an intermediary) returned an empty, non-JSON, or malformed JSON response (especially in error scenarios), the `.json()` method failed.

**Fix:**
1.  **`src/lib/apiResponse.ts`:** Modified `unwrapApi` to safely parse responses. It now checks the `Content-Type` header. If it's `application/json`, it attempts `res.json()`. If that fails, or if the `Content-Type` is not JSON, it falls back to `res.text()` and generates a more informative `ApiError` with a generic message (e.g., "API Error: Invalid JSON response").
2.  **`src/components/RfpForm.tsx`:** Updated `fetch` calls for `/api/upload-url` and `/api/rfp-submit` to directly await `unwrapApi(response)` instead of `await response.json()` followed by `unwrapApi(response, json)`, leveraging the new robust parsing within `unwrapApi`.

**Outcome:** The fix ensures that the frontend gracefully handles non-JSON or malformed JSON responses, preventing the "Unexpected end of JSON input" error and providing more user-friendly error messages.

**Verification:** Code changes committed and pushed. Deployment completed successfully. Manual verification of the form submission in a browser is required due to Vercel authentication on preview URLs preventing direct API testing via `Invoke-WebRequest`.

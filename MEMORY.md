# MEMORY.md

## 2026-04-04 - Production Bug Fix: "Unexpected end of JSON input" in Next.js RFP Form

**Issue:** Users were seeing "Unexpected end of JSON input" when uploading a PDF and submitting an RFP form in a Next.js application.

**Root Cause:** The frontend's `unwrapApi` helper (and direct `res.json()` calls) implicitly assumed all API responses would be valid JSON. When an API endpoint (or an intermediary) returned an empty, non-JSON, or malformed JSON response (especially in error scenarios), the `.json()` method failed.

**Fix:**
1.  **`src/lib/apiResponse.ts`:** Modified `unwrapApi` to safely parse responses. It now checks the `Content-Type` header. If it's `application/json`, it attempts `res.json()`. If that fails, or if the `Content-Type` is not JSON, it falls back to `res.text()` and generates a more informative `ApiError` with a generic message (e.g., "API Error: Invalid JSON response").
2.  **`src/components/RfpForm.tsx`:** Updated `fetch` calls for `/api/upload-url` and `/api/rfp-submit` to directly await `unwrapApi(response)` instead of `await response.json()` followed by `unwrapApi(response, json)`, leveraging the new robust parsing within `unwrapApi`.

**Outcome:** The fix ensures that the frontend gracefully handles non-JSON or malformed JSON responses, preventing the "Unexpected end of JSON input" error and providing more user-friendly error messages.

**Verification:** Code changes committed and pushed. Deployment completed successfully. Manual verification of the form submission in a browser is required due to Vercel authentication on preview URLs preventing direct API testing via `Invoke-WebRequest`.

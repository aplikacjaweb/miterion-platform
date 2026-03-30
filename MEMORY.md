# MEMORY.md

## Deployment / Vercel Safety Requirements

Implement all changes with Vercel production deployment in mind.

Rules:

1.  Do NOT introduce dependencies that are likely to fail in Vercel serverless builds.
2.  Keep the existing working architecture. Do not refactor PDF generation unless strictly necessary.
3.  Do NOT add heavy browser/runtime dependencies unless already present and verified in production.
4.  All new fields in forms must be optional-safe and must not break PDF generation if missing.
5.  All API routes must fail gracefully with clear error responses.
6.  Validate required environment variables explicitly and provide readable fallback errors.
7.  Keep all server-only logic in API/server files. Do not leak server-side dependencies into client components.
8.  Do not assume persistent local filesystem access.
9.  Any new feature must work both in local dev and in Vercel production.
10. Prefer minimal, robust implementation over complex architecture.

Success criteria:
-   npm run build should pass
-   no new runtime dependency conflicts
-   no white screen on deploy
-   free snapshot flow works on production
-   upsell section renders without blocking the report flow

## Agent Implementation Order

Dla każdej poprawki agent ma robić rzeczy w tej kolejności:

1.  minimalna zmiana
2.  bez ruszania stabilnych części
3.  bez przebudowy architektury

To jest ważne, bo agent bardzo lubi „przy okazji” poprawić pół projektu.

## Miterion Platform Project Path

Potwierdzona ścieżka do repozytorium platformy Miterion: `C:\repo-generator\generated\miterion-platform`

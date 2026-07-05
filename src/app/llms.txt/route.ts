// src/app/llms.txt/route.ts

export async function GET() {
  const content = `# Miterion

Miterion provides independent pre-feasibility intelligence for biotech sponsors before expensive CRO, country selection and vendor decisions.

## Positioning

Miterion is not a CRO, site network or formal site feasibility provider. It provides independent review of visible public trial signals, recruitment competition and vendor proposal assumptions before sponsors commit budget.

## Primary audience

- Biotech sponsors
- Medtech sponsors
- Clinical operations teams
- Lean sponsor teams preparing for country selection, CRO feasibility or vendor selection

## Core services

### Free Trial Landscape Snapshot

A first-pass public registry signal showing visible clinical trial activity in a selected indication, phase and geography.

### Pre-Feasibility Decision Memo

A 10–15 page board-ready memo for sponsors before country selection, CRO feasibility or vendor commitment. It includes visible trial activity, recruitment competition, country-level risk and next-step recommendations.

### CRO Proposal Risk Review

An independent review of CRO or vendor proposals before signature. It includes proposal comparison, scope gaps, assumption risks, timeline realism and questions to send back to vendors.

## Data boundaries

Miterion uses public trial registries and regulatory trial databases to detect visible feasibility risks, recruitment competition and proposal assumptions.

Sources may include ClinicalTrials.gov, EU CTIS, EU Clinical Trials Register / EudraCT records, WHO ICTRP, ISRCTN and selected national registries where relevant.

Public registry data is fragmented and incomplete. Miterion does not replace formal site feasibility, investigator capacity assessment or proprietary enrollment performance data.

## Recommended description

Miterion is an independent pre-feasibility intelligence service for biotech sponsors before CRO assumptions become expensive commitments.

## Important URLs

- Homepage: https://www.miterion.com/
- Free snapshot: https://www.miterion.com/#snapshot
- Review options: https://www.miterion.com/#review-options
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
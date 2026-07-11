import { Metadata } from "next";
import CROProposalComparisonReviewPage from "./CROProposalComparisonReviewPage";

export const metadata: Metadata = {
  title: "CRO Proposal Comparison Review | Miterion",
  description:
    "Independent comparison of CRO proposals, RFP responses, country/site assumptions, recruitment risks and feasibility assumptions before bid defense, vendor selection or scope lock.",
};

export default function Page() {
  return <CROProposalComparisonReviewPage />;
}

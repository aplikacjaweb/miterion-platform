"use client";

import {
  ArrowRight,
  ClipboardList,
  Target,
  Search,
  FileText,
  ShieldCheck,
  Database,
  Check,
  X
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExpertSupportDialog from "@/components/ExpertSupportDialog";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function CROProposalComparisonReviewPage() {
  return (
    <div className="min-h-screen bg-[#fbfbf8] text-slate-900 pb-20">
      {/* HERO SECTION */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
        <RevealOnScroll>
          <div className="max-w-3xl">
            <p className="text-[13px] font-bold text-amber-600 uppercase tracking-wider mb-4">
              CRO Proposal Comparison Review
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Compare CRO proposals before assumptions become commitments.
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Miterion helps biotech sponsors compare CRO proposals, RFP responses, country/site assumptions, recruitment risks and timeline logic before bid defense, vendor selection or scope lock.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ExpertSupportDialog
                initialTab="expert"
                trigger={
                  <Button className="rounded-full gap-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-[15px] px-6 py-6 w-full sm:w-auto h-auto">
                    Request Proposal Comparison <ArrowRight className="h-4 w-4" />
                  </Button>
                }
              />
              <a
                href="#what-we-compare"
                className="text-[14px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                See what we compare
              </a>
            </div>
            <p className="text-[13px] text-slate-400 mt-4">
              Up to 3 proposals · 48–72h review · public registry signals · manual validation · clear data limits
            </p>
          </div>
        </RevealOnScroll>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-16 sm:py-24 bg-[#f7f7f3] border-y border-[#deded8]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <RevealOnScroll>
            <div className="max-w-2xl mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
                CRO proposals are hard to compare when every vendor uses different assumptions.
              </h2>
              <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed">
                <p>
                  One CRO may recommend a broader country mix. Another may propose fewer sites. A third may show a faster timeline or lower cost. On paper, each proposal can look reasonable.
                </p>
                <p>
                  The problem is that the proposals may be based on different assumptions about recruitment pressure, site availability, country feasibility, startup timelines and operational scope.
                </p>
                <p>
                  Miterion helps the sponsor compare these assumptions before vendor selection, bid defense or scope lock.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-[#deded8] bg-white p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Different country strategies</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  Each CRO may recommend a different country mix, making it difficult to know whether the difference is strategic or assumption-driven.
                </p>
              </div>
              <div className="rounded-2xl border border-[#deded8] bg-white p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Different site-count logic</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  Site numbers can look precise, but the underlying recruitment and activation assumptions may not be comparable.
                </p>
              </div>
              <div className="rounded-2xl border border-[#deded8] bg-white p-6">
                <h3 className="font-semibold text-slate-900 mb-2">Different timelines and scope</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed">
                  Lower cost or faster delivery may come from hidden scope differences, optimistic startup assumptions or underweighted recruitment competition.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* WHAT WE COMPARE */}
      <section id="what-we-compare" className="py-16 sm:py-24">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <RevealOnScroll>
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
                What we compare
              </h2>
              <p className="text-lg text-slate-600">
                A structured comparison of CRO proposals, RFP responses and feasibility assumptions — not a procurement checklist.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Country mix",
                  desc: "How each proposal frames geography, country-level trial activity, visible competition and sponsor footprint.",
                  icon: Target
                },
                {
                  title: "Site count assumptions",
                  desc: "How each CRO justifies the proposed site footprint and whether the logic appears directionally supported.",
                  icon: Database
                },
                {
                  title: "Timeline assumptions",
                  desc: "How startup, activation and enrollment timelines differ across proposals and where clarification is needed.",
                  icon: ClipboardList
                },
                {
                  title: "Recruitment competition",
                  desc: "Where public registry signals suggest visible pressure for the same patient population.",
                  icon: Search
                },
                {
                  title: "Scope differences",
                  desc: "Where proposals may not be directly comparable because of differences in services, assumptions or exclusions.",
                  icon: FileText
                },
                {
                  title: "Feasibility assumption gaps",
                  desc: "Which assumptions are supported, weakly supported or impossible to confirm from public data alone.",
                  icon: ShieldCheck
                }
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-[#deded8] bg-white p-6 hover:border-[#cfcfc7] transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-4">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-16 sm:py-24 bg-[#f7f7f3] border-y border-[#deded8]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <RevealOnScroll>
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
                What you get
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl">
                A decision-ready comparison designed to help the sponsor challenge, narrow or clarify CRO proposals before commitment.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Proposal comparison matrix",
                  desc: "A structured side-by-side comparison of country mix, site assumptions, timeline logic, visible risks and scope gaps."
                },
                {
                  title: "Feasibility assumption gap list",
                  desc: "A list of weak, unsupported or overly optimistic assumptions across proposals."
                },
                {
                  title: "Country/site strategy comparison",
                  desc: "A focused view of how different CROs frame country and site strategy — and what public signals suggest."
                },
                {
                  title: "Bid defense questions",
                  desc: "Practical questions to send back to each CRO before bid defense, vendor selection or scope lock."
                },
                {
                  title: "Recommended next steps",
                  desc: "Clear decision support: proceed, challenge, clarify, narrow or pause."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-[#deded8] bg-white">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-[14px] text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* PUBLIC DATA LIMITATIONS */}
      <section className="py-16 sm:py-24">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <RevealOnScroll>
            <div className="mb-12 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-4">
                What public data can and cannot support
              </h2>
              <p className="text-lg text-slate-600">
                Public registry data is useful for early risk detection, but it does not replace formal site feasibility or direct site outreach.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-600" /> Public data can help detect:
                </h3>
                <ul className="space-y-3">
                  {[
                    "visible recruitment competition",
                    "crowded indications",
                    "country-level trial activity",
                    "sponsor presence",
                    "registry inconsistencies",
                    "weak assumptions in proposal narratives",
                    "visible mismatch between public signals and vendor claims",
                    "proposal differences that need vendor clarification"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-slate-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" /> Public data cannot confirm:
                </h3>
                <ul className="space-y-3">
                  {[
                    "actual site enrollment performance",
                    "investigator availability",
                    "contracted recruitment targets",
                    "coordinator capacity",
                    "contract and budget negotiation timelines",
                    "true site readiness",
                    "real screen-failure risk",
                    "operational execution quality"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-slate-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 text-white max-w-4xl">
              <p className="text-[15px] font-medium leading-relaxed">
                That is why Miterion does not replace formal feasibility. It gives sponsors an independent comparison layer before proposal assumptions become commitments.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* DELIVERY FLOW */}
      <section className="py-16 sm:py-24 bg-[#f7f7f3] border-y border-[#deded8]">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
          <RevealOnScroll>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-12 text-center">
              How the comparison is delivered
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-[1px] bg-[#deded8]" />
              
              {[
                {
                  step: "01",
                  title: "Send the proposals or decision context",
                  desc: "Tell us what you need to compare: CRO proposals, RFP responses, country shortlist, phase, indication and target geography."
                },
                {
                  step: "02",
                  title: "We compare assumptions and public signals",
                  desc: "Miterion compares proposal logic against visible registry activity, recruitment competition, sponsor footprint and country/site assumptions."
                },
                {
                  step: "03",
                  title: "You receive a decision-ready comparison memo",
                  desc: "You get a focused memo with a comparison matrix, assumption gaps, CRO-specific questions and recommended next steps before vendor selection or scope lock."
                }
              ].map((item, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[14px] mb-6 shadow-[0_0_0_4px_#f7f7f3]">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3 text-lg px-2">{item.title}</h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed max-w-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-32">
        <div className="px-4 sm:px-6 lg:px-8 max-w-[800px] mx-auto text-center">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-6">
              Comparing CRO proposals before vendor selection?
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Request an independent comparison before feasibility assumptions become budget, timeline and execution risk.
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <ExpertSupportDialog
                initialTab="expert"
                trigger={
                  <Button className="rounded-full gap-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-[15px] px-8 py-6 h-auto w-full sm:w-auto">
                    Request Proposal Comparison <ArrowRight className="h-4 w-4" />
                  </Button>
                }
              />
              <Link
                href="/"
                className="text-[14px] font-medium text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
              >
                Back to homepage
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}

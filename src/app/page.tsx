'use client';

import {
  ArrowRight,
  Database,
  Check,
  Target,
  ClipboardList,
  Search,
  FileText,
  ShieldCheck,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import SnapshotForm from "@/components/SnapshotForm";
import ExpertSupportDialog from "@/components/ExpertSupportDialog";
import RevealOnScroll from "@/components/RevealOnScroll";
import { getCalApi } from '@calcom/embed-react';

const dotGridBg = {
  backgroundImage:
    "radial-gradient(circle, #d9d9d4 1.1px, transparent 1.1px)",
  backgroundSize: "24px 24px",
};

export default function Home() {
  // Integracja z Cal.com dla sekcji końcowej
  const openCal = async () => {
    const cal = await getCalApi({ namespace: 'miterion-cal' });
    cal('modal', {
      calLink: 'web-app-xkqbra',
      config: { layout: 'month_view' }
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* 1. HERO SECTION */}
      <section
        className="relative overflow-hidden border-b border-[#deded8] bg-[#f7f7f3]"
        style={dotGridBg}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/65 to-transparent" />

        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 sm:pb-24 text-center">
          <RevealOnScroll>
            <div className="mx-auto max-w-[860px]">
              <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.22em] text-slate-500">
                Independent pre-feasibility intelligence for biotech sponsors
              </p>

              <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-normal tracking-tight leading-[1.04] flex flex-col">
                <span>Don't Buy Feasibility Blind.</span>
                <span className="text-slate-400">
                  See the risk before it gets expensive.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-[660px] text-[17px] sm:text-[18px] text-slate-500 leading-relaxed font-normal">
                Miterion reviews public trial data, visible recruitment competition and vendor proposal assumptions before you commit budget to country selection, formal feasibility or CRO contracts.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="#snapshot" className="inline-block">
                  <Button
                    size="lg"
                    className="rounded-full gap-2 min-h-[50px] bg-slate-900 text-white hover:bg-slate-800 font-medium text-[15px] px-8 transition-all duration-300 hover:scale-[1.015] hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.98]"
                  >
                    Generate Free Snapshot <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>

                <a href="#starting-points" className="inline-block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full min-h-[50px] border-[#deded8] bg-white/80 px-7 text-[15px] font-medium text-slate-700 transition-all hover:border-[#cfcfc7] hover:bg-white"
                  >
                    See Review Options
                  </Button>
                </a>
              </div>
            </div>
          </RevealOnScroll>

          {/* HERO MOCKUP */}
          <div className="hidden md:block">
            <RevealOnScroll delay={140} y={24}>
              <div className="mx-auto mt-14 max-w-[980px] relative z-10 md:[mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]">
                <div className="overflow-hidden rounded-2xl border border-[#deded8] bg-[#fbfbf8] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)]">
                  <div className="flex items-center justify-between border-b border-[#e6e6df] bg-[#f7f7f3]/90 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                      <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                    </div>

                    <div className="hidden sm:block text-[12px] font-medium text-slate-400">
                      pre-feasibility-decision-memo
                    </div>

                    <div className="h-3 w-[52px]" />
                  </div>

                  <div className="p-6 sm:p-8 lg:p-10 text-left">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#deded8] bg-white/70 px-3 py-1 text-[12px] font-medium text-slate-500">
                          <Database className="h-3.5 w-3.5" />
                          Independent risk review before CRO commitment
                        </div>

                        <h2 className="mt-5 text-[22px] sm:text-[26px] font-semibold tracking-tight text-slate-900">
                          Pre-Feasibility Decision Memo
                        </h2>

                        <p className="mt-3 max-w-[560px] text-[15px] sm:text-[16px] leading-relaxed text-slate-500">
                          Turn public trial signals and vendor assumptions into a board-ready decision memo before formal feasibility or CRO commitment.
                        </p>

                        <div className="mt-7 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-[#e6e6df] bg-white/65 p-4">
                            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-400">
                              Indication
                            </p>
                            <p className="mt-2 text-[14px] font-semibold text-slate-900">
                              Multiple sclerosis
                            </p>
                          </div>

                          <div className="rounded-xl border border-[#e6e6df] bg-white/65 p-4">
                            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-400">
                              Phase
                            </p>
                            <p className="mt-2 text-[14px] font-semibold text-slate-900">
                              Phase II
                            </p>
                          </div>

                          <div className="rounded-xl border border-[#e6e6df] bg-white/65 p-4">
                            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-slate-400">
                              Geography
                            </p>
                            <p className="mt-2 text-[14px] font-semibold text-slate-900">
                              EU
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#deded8] bg-white p-4 sm:p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-[13px] font-semibold text-slate-900">
                            Decision preview
                          </p>
                          <span className="rounded-full bg-[#f1f1ec] px-2.5 py-1 text-[11px] font-medium text-slate-500">
                            Sample
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between rounded-xl border border-[#e6e6df] bg-[#fbfbf8] px-4 py-3">
                            <span className="text-[13px] text-slate-500">
                              Recruitment competition
                            </span>
                            <span className="text-[14px] font-semibold text-slate-900">
                              High
                            </span>
                          </div>

                          <div className="flex items-center justify-between rounded-xl border border-[#e6e6df] bg-[#fbfbf8] px-4 py-3">
                            <span className="text-[13px] text-slate-500">
                              Country-level risk
                            </span>
                            <span className="text-[14px] font-semibold text-slate-900">
                              Medium
                            </span>
                          </div>

                          <div className="flex items-center justify-between rounded-xl border border-[#e6e6df] bg-[#fbfbf8] px-4 py-3">
                            <span className="text-[13px] text-slate-500">
                              CRO assumption gaps
                            </span>
                            <span className="text-[14px] font-semibold text-slate-900 text-amber-600">
                              4
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 rounded-xl border border-[#e6e6df] bg-[#fbfbf8] px-4 py-3">
                            <span className="text-[12px] text-slate-400 uppercase tracking-wider font-medium">
                              Recommended next step
                            </span>
                            <span className="text-[13px] font-semibold text-slate-900">
                              Narrow country shortlist before RFP
                            </span>
                          </div>
                        </div>

                        <div className="mt-5 border-t border-[#e6e6df] pt-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#deded8] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500">
                              <Check className="h-3.5 w-3.5 text-slate-400" />
                              Public registry signal
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#deded8] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500">
                              <Check className="h-3.5 w-3.5 text-slate-400" />
                              CTIS / EU view
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#deded8] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500">
                              <Check className="h-3.5 w-3.5 text-slate-400" />
                              Manual expert validation
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE THE RIGHT STARTING POINT SECTION */}
      <section
        id="starting-points"
        className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[#deded8]"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mb-12 text-center">
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-4">
                Engagement Options
              </p>
              <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] font-normal text-slate-900 leading-tight tracking-tight">
                Choose the right starting point
              </h2>
              <p className="mt-4 text-[17px] text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
                Start with a free public registry signal, or request an analyst-led review when the decision carries budget risk.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* CARD 1: FREE SNAPSHOT */}
            <RevealOnScroll delay={0}>
              <div className="group relative rounded-2xl border border-[#deded8] bg-[#fbfbf8] p-6 sm:p-8 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] flex flex-col justify-between min-h-[420px]">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 mb-6">
                    <Search className="h-6 w-6" />
                  </div>

                  <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-slate-900">
                    Free Snapshot
                  </h3>

                  <p className="mt-4 text-[15px] text-slate-600 leading-relaxed">
                    For a first-pass view of visible clinical trial activity in your indication, phase and geography.
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-[#e6e6df] pt-5">
                    <li className="text-[14px] text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      Automated public registry signal.
                    </li>
                    <li className="text-[14px] text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      Useful for checking whether a landscape looks crowded, thin, sponsor-heavy or worth deeper review.
                    </li>
                    <li className="text-[14px] font-semibold text-slate-900 mt-2">
                      Free
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <a href="#snapshot" className="inline-block w-full">
                    <Button
                      variant="outline"
                      className="w-full rounded-full gap-2 border-[#deded8] bg-white hover:bg-slate-50 font-medium text-[14px]"
                    >
                      Generate Snapshot <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            {/* CARD 2: PRE-FEASIBILITY DECISION MEMO */}
            <RevealOnScroll delay={90}>
              <div className="group relative rounded-2xl border border-[#deded8] bg-[#fbfbf8] p-6 sm:p-8 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] flex flex-col justify-between min-h-[420px]">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-6">
                    <Target className="h-6 w-6" />
                  </div>

                  <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-slate-900">
                    Pre-Feasibility Decision Memo
                  </h3>

                  <p className="mt-4 text-[15px] text-slate-600 leading-relaxed">
                    For sponsors before country selection or formal CRO feasibility.
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-[#e6e6df] pt-5">
                    <li className="text-[14px] text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      10–15 page board-ready PDF.
                    </li>
                    <li className="text-[14px] text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      Includes visible trial activity, recruitment competition, country-level risk and next-step recommendations.
                    </li>
                    <li className="text-[14px] text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      Delivery: 72h after scope.
                    </li>
                    <li className="text-[14px] font-semibold text-slate-900 mt-2">
                      From €2,500
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <ExpertSupportDialog
                    trigger={
                      <Button className="w-full rounded-full gap-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-[14px]">
                        Request Report <ArrowRight className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </RevealOnScroll>

            {/* CARD 3: CRO PROPOSAL RISK REVIEW */}
            <RevealOnScroll delay={180}>
              <div className="group relative rounded-2xl border border-[#deded8] bg-[#fbfbf8] p-6 sm:p-8 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] flex flex-col justify-between min-h-[420px]">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white mb-6">
                    <ClipboardList className="h-6 w-6" />
                  </div>

                  <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-tight text-slate-900">
                    CRO Proposal Risk Review
                  </h3>

                  <p className="mt-4 text-[15px] text-slate-600 leading-relaxed">
                    For sponsors before country selection, CRO feasibility or vendor commitment.
                  </p>

                  <ul className="mt-6 space-y-3 border-t border-[#e6e6df] pt-5">
                    <li className="text-[14px] text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      Includes proposal comparison matrix, scope gaps, assumption risks, timeline realism and questions to send back to vendors.
                    </li>
                    <li className="text-[14px] text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      Delivery: 48–72h after document review.
                    </li>
                    <li className="text-[14px] text-slate-600 flex items-start gap-2">
                      <span className="text-slate-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                      From €3,500 for up to 3 proposals. Additional vendors priced after review.
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <ExpertSupportDialog
                    trigger={
                      <Button className="w-full rounded-full gap-2 bg-slate-900 text-white hover:bg-slate-800 font-medium text-[14px]">
                        Start Harmonization <ArrowRight className="h-4 w-4" />
                      </Button>
                    }
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 3. HOW MITERION WORKS SECTION */}
      <section className="py-20 sm:py-28 bg-white border-b border-[#deded8]">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mb-16 text-center">
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-4">
                Process
              </p>
              <h2 className="text-[32px] sm:text-[42px] font-normal text-slate-900 tracking-tight">
                How Miterion works
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <RevealOnScroll delay={0}>
              <div className="relative p-6 rounded-xl border border-dashed border-[#deded8] bg-[#fbfbf8]/40">
                <div className="text-[44px] font-light text-slate-300 mb-2">01</div>
                <h3 className="text-[18px] font-semibold text-slate-900 mb-3">
                  We collect visible signals
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Public trial registries, CTIS/EU records, WHO ICTRP, ISRCTN, selected national registries and vendor assumptions where provided.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={90}>
              <div className="relative p-6 rounded-xl border border-dashed border-[#deded8] bg-[#fbfbf8]/40">
                <div className="text-[44px] font-light text-slate-300 mb-2">02</div>
                <h3 className="text-[18px] font-semibold text-slate-900 mb-3">
                  We normalize and validate
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Public data is fragmented and uneven. Miterion combines automated retrieval where available with manual expert validation.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={180}>
              <div className="relative p-6 rounded-xl border border-dashed border-[#deded8] bg-[#fbfbf8]/40">
                <div className="text-[44px] font-light text-slate-300 mb-2">03</div>
                <h3 className="text-[18px] font-semibold text-slate-900 mb-3">
                  We turn it into a decision memo
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  You get risk signals, country-level implications, proposal gaps and recommended next questions before committing budget.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* 4. WHY INDEPENDENT REVIEW MATTERS SECTION */}
      <section
        className="py-20 sm:py-28 bg-[#f7f7f3] border-b border-[#deded8]"
        style={dotGridBg}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-4">
                Our Position
              </p>
              <h2 className="text-[32px] sm:text-[42px] font-normal text-slate-900 tracking-tight">
                Why independent review matters
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid gap-6 md:grid-cols-3">
            <RevealOnScroll delay={0}>
              <div className="rounded-2xl border border-[#deded8] bg-white p-6 sm:p-8 shadow-sm h-full flex flex-col">
                <h3 className="text-[18px] font-semibold text-slate-900 mb-4">
                  Independent
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Miterion does not sell countries, sites or CRO services. We review assumptions before they become commitments.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={80}>
              <div className="rounded-2xl border border-[#deded8] bg-white p-6 sm:p-8 shadow-sm h-full flex flex-col">
                <h3 className="text-[18px] font-semibold text-slate-900 mb-4">
                  Fast
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Focused decision intelligence in 48–72 hours, not a long consulting process.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={160}>
              <div className="rounded-2xl border border-[#deded8] bg-white p-6 sm:p-8 shadow-sm h-full flex flex-col">
                <h3 className="text-[18px] font-semibold text-slate-900 mb-4">
                  Clear data limits
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed">
                  Public registry data can reveal visible feasibility risks, but it does not replace formal site feasibility. Miterion shows what the data can and cannot support.
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={200}>
            <div className="mt-12 text-center">
              <p className="text-[12px] text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Sources may include ClinicalTrials.gov, EU CTIS, EU Clinical Trials Register / EudraCT records, WHO ICTRP, ISRCTN and selected national registries where relevant.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* 5. SNAPSHOT FORM SECTION (LEAD MAGNET) */}
      <section
        id="snapshot"
        className="py-20 sm:py-28 lg:py-36 bg-white border-b border-[#deded8] scroll-mt-12"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mb-14 sm:mb-20 text-center">
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-4">
                Free Tool
              </p>

              <h2 className="text-[32px] sm:text-[42px] lg:text-[50px] font-normal text-slate-900 leading-tight tracking-tight">
                Generate Your Free Trial Landscape Snapshot
              </h2>

              <p className="mt-5 text-[17px] text-slate-500 max-w-xl mx-auto font-normal leading-relaxed">
                See visible recruitment competition signals from public registry data.
              </p>
            </div>
          </RevealOnScroll>

          <div className="mx-auto max-w-[880px]">
            <RevealOnScroll y={24}>
              <div className="rounded-2xl border border-[#deded8] bg-[#fbfbf8] p-5 sm:p-8 lg:p-10 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.28)]">
                <SnapshotForm />
              </div>
            </RevealOnScroll>

            <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
              <RevealOnScroll delay={0}>
                <div className="rounded-2xl border border-[#deded8] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <h4 className="text-[17px] font-semibold text-slate-900">
                    What it tells you
                  </h4>

                  <p className="mt-3 text-[15px] text-slate-500 leading-relaxed font-normal">
                    The snapshot shows visible activity in structured public registry data. It can help you see whether your indication and geography look crowded, thin, sponsor-heavy or worth deeper review.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={90}>
                <div className="rounded-2xl border border-[#deded8] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f1ec] text-slate-600">
                    <FileText className="h-5 w-5" />
                  </div>

                  <h4 className="text-[17px] font-semibold text-slate-900">
                    What it cannot tell you
                  </h4>

                  <p className="mt-3 text-[15px] text-slate-500 leading-relaxed font-normal">
                    It does not show actual site enrollment performance, investigator capacity, contract timelines, coordinator availability, or operational readiness. These require formal feasibility work.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-20 sm:py-28 bg-[#fbfbf8]">
        <div className="mx-auto max-w-[800px] px-4 text-center">
          <RevealOnScroll>
            <h2 className="text-[28px] sm:text-[38px] font-normal text-slate-900 tracking-tight">
              Not sure which path fits your trial?
            </h2>
            <p className="mt-4 text-[16px] sm:text-[18px] text-slate-500 max-w-xl mx-auto font-normal leading-relaxed">
              Send a custom review request or book a short call if the decision is urgent.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ExpertSupportDialog
                trigger={
                  <Button
                    size="lg"
                    className="w-full sm:w-auto rounded-full min-h-[50px] bg-slate-900 text-white hover:bg-slate-800 font-medium text-[15px] px-8 transition-all"
                  >
                    Request Custom Review
                  </Button>
                }
              />

              <Button
                size="lg"
                variant="outline"
                onClick={openCal}
                className="w-full sm:w-auto rounded-full min-h-[50px] border-[#deded8] bg-white px-7 text-[15px] font-medium text-slate-700 gap-2 transition-all hover:bg-slate-50"
              >
                <Phone className="h-4 w-4 text-slate-400" /> Book a 20-min review call
              </Button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
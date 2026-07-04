import {
  ArrowRight,
  BarChart3,
  Check,
  Database,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import SnapshotForm from "@/components/SnapshotForm";
import DctWaitlistForm from "@/components/DctWaitlistForm";
import ExpertSupportDialog from "@/components/ExpertSupportDialog";
import RevealOnScroll from "@/components/RevealOnScroll";

const dotGridBg = {
  backgroundImage:
    "radial-gradient(circle, #d9d9d4 1.1px, transparent 1.1px)",
  backgroundSize: "24px 24px",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden border-b border-[#deded8] bg-[#f7f7f3]"
        style={dotGridBg}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/65 to-transparent" />

        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 sm:pb-24 text-center">
          <RevealOnScroll>
            <div className="mx-auto max-w-[860px]">
              <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.22em] text-slate-500">
                Clinical Operations Intelligence
              </p>

              <h1 className="text-[38px] sm:text-[52px] lg:text-[64px] font-normal tracking-tight leading-[1.04] flex flex-col">
                <span>Don’t Buy Feasibility Blind.</span>
                <span className="text-slate-400">
                  See the risk before it gets expensive.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-[660px] text-[17px] sm:text-[18px] text-slate-500 leading-relaxed font-normal">
                Before you commit budget to formal feasibility, country
                selection or vendor contracts, see what public trial data and
                proposal assumptions already reveal.
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

                <a
                  href="#solutions"
                  className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#deded8] bg-white/80 px-7 text-[15px] font-medium text-slate-700 transition-all hover:border-[#cfcfc7] hover:bg-white"
                >
                  View analytical paths
                </a>
              </div>
            </div>
          </RevealOnScroll>

          {/* HERO MOCKUP */}
          <RevealOnScroll delay={140} y={24}>
            <div className="mx-auto mt-14 max-w-[980px] relative z-10">
              <div className="overflow-hidden rounded-2xl border border-[#deded8] bg-[#fbfbf8] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.38)]">
                <div className="flex items-center justify-between border-b border-[#e6e6df] bg-[#f7f7f3]/90 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#c9c9c1]" />
                    <span className="h-3 w-3 rounded-full bg-[#d5d5ce]" />
                    <span className="h-3 w-3 rounded-full bg-[#e0e0d8]" />
                  </div>

                  <div className="hidden sm:block text-[12px] font-medium text-slate-400">
                    clinical-landscape-snapshot
                  </div>

                  <div className="h-3 w-[52px]" />
                </div>

                <div className="p-6 sm:p-8 lg:p-10 text-left">
                  <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#deded8] bg-white/70 px-3 py-1 text-[12px] font-medium text-slate-500">
                        <Database className="h-3.5 w-3.5" />
                        Public registry intelligence
                      </div>

                      <h2 className="mt-5 text-[22px] sm:text-[26px] font-semibold tracking-tight text-slate-900">
                        De-Risk Country, Protocol and Vendor Decisions
                      </h2>

                      <p className="mt-3 max-w-[560px] text-[15px] sm:text-[16px] leading-relaxed text-slate-500">
                        Start with a free data snapshot, move to analytical
                        reports, or compare CRO proposals.
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
                          Snapshot preview
                        </p>
                        <span className="rounded-full bg-[#f1f1ec] px-2.5 py-1 text-[11px] font-medium text-slate-500">
                          Sample
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded-xl border border-[#e6e6df] bg-[#fbfbf8] px-4 py-3">
                          <span className="text-[13px] text-slate-500">
                            Active trials
                          </span>
                          <span className="text-[15px] font-semibold text-slate-900">
                            124
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-[#e6e6df] bg-[#fbfbf8] px-4 py-3">
                          <span className="text-[13px] text-slate-500">
                            Recruiting sites
                          </span>
                          <span className="text-[15px] font-semibold text-slate-900">
                            316
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-[#e6e6df] bg-[#fbfbf8] px-4 py-3">
                          <span className="text-[13px] text-slate-500">
                            Recruitment competition
                          </span>
                          <span className="text-[13px] font-semibold text-slate-900">
                            High
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-[#e6e6df] bg-[#fbfbf8] px-4 py-3">
                          <span className="text-[13px] text-slate-500">
                            Protocol risk flags
                          </span>
                          <span className="text-[15px] font-semibold text-slate-900">
                            5
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-[#e6e6df] pt-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#deded8] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500">
                            <Check className="h-3.5 w-3.5 text-slate-400" />
                            Registry data
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#deded8] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500">
                            <Check className="h-3.5 w-3.5 text-slate-400" />
                            CTIS signal
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#deded8] bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500">
                            <Check className="h-3.5 w-3.5 text-slate-400" />
                            Country view
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
      </section>

      {/* SERVICE CARDS SECTION */}
      <section
        id="solutions"
        className="py-20 sm:py-28 lg:py-36 bg-white scroll-mt-12"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mb-14 sm:mb-20">
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-4">
                Our Solutions
              </p>

              <h2 className="text-[32px] sm:text-[42px] lg:text-[50px] font-normal text-slate-900 leading-tight tracking-tight">
                Three analytical paths to
                <br className="hidden sm:block" /> smarter decisions
              </h2>

              <p className="mt-5 text-[17px] text-slate-500 max-w-xl font-normal leading-relaxed">
                Actionable insights adapted to your current stage of trial
                planning.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid gap-5 lg:grid-cols-3">
            <RevealOnScroll className="h-full" delay={0}>
              <div className="h-full group relative rounded-2xl border border-[#deded8] bg-white p-6 sm:p-7 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <Search className="h-5 w-5" />
                    </div>
                    <span className="text-[13px] font-medium text-slate-400">
                      01
                    </span>
                  </div>

                  <h3 className="text-[19px] font-semibold tracking-tight text-slate-900">
                    Clinical Landscape Snapshot
                  </h3>

                  <p className="mt-3 text-[15px] text-slate-500 leading-relaxed font-normal">
                    Free first-pass view of visible clinical trial activity in
                    your indication, phase and geography. Use public registry
                    data to see where similar studies are active.
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#e6e6df] flex items-center justify-between gap-4">
                  <span className="text-[13px] text-slate-400">
                    Free & Instant
                  </span>

                  <a
                    href="#snapshot"
                    className="text-[14px] text-slate-900 font-medium hover:text-slate-600 transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    Generate Snapshot <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="h-full" delay={90}>
              <div className="h-full group relative rounded-2xl border border-[#deded8] bg-white p-6 sm:p-7 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-[13px] font-medium text-slate-400">
                      02
                    </span>
                  </div>

                  <h3 className="text-[19px] font-semibold tracking-tight text-slate-900">
                    Pre-Feasibility Decision Report
                  </h3>

                  <p className="mt-3 text-[15px] text-slate-500 leading-relaxed font-normal">
                    Analyst-led decision memo before formal feasibility. We
                    review public registries, CTIS, national sources,
                    publications and visible competition signals.
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#e6e6df] flex items-center justify-between gap-4">
                  <span className="text-[13px] text-slate-400">
                    Analyst-led
                  </span>

                  <ExpertSupportDialog
                    initialTab="expert"
                    trigger={
                      <button className="text-[14px] text-slate-900 font-medium hover:text-slate-600 transition-colors flex items-center gap-1 whitespace-nowrap">
                        Request Report <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    }
                  />
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll className="h-full" delay={180}>
              <div className="h-full group relative rounded-2xl border border-[#deded8] bg-white p-6 sm:p-7 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-7">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <span className="text-[13px] font-medium text-slate-400">
                      03
                    </span>
                  </div>

                  <h3 className="text-[19px] font-semibold tracking-tight text-slate-900">
                    RFP & Budget Harmonization
                  </h3>

                  <p className="mt-3 text-[15px] text-slate-500 leading-relaxed font-normal">
                    Compare CRO and vendor proposals before you choose a
                    partner. We normalize scope, assumptions, pass-through costs
                    and budget risks.
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#e6e6df] flex items-center justify-between gap-4">
                  <span className="text-[13px] text-slate-400">
                    CRO Normalization
                  </span>

                  <ExpertSupportDialog
                    initialTab="quote"
                    trigger={
                      <button className="text-[14px] text-slate-900 font-medium hover:text-slate-600 transition-colors flex items-center gap-1 whitespace-nowrap">
                        Start Harmonization{" "}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    }
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section
        className="py-20 sm:py-32 lg:py-40 bg-[#f7f7f3] border-t border-b border-[#deded8]"
        style={dotGridBg}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mb-16 sm:mb-24">
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-4">
                Pricing
              </p>

              <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-normal text-slate-900 leading-tight tracking-tight">
                Start free. Go deeper
                <br className="hidden sm:block" /> when the decision matters.
              </h2>

              <p className="mt-5 text-[17px] text-slate-500 max-w-xl font-normal leading-relaxed">
                Transparent scaling for teams that need a fast signal first and
                deeper analysis before committing budget.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <RevealOnScroll delay={0}>
              <div className="relative">
                <span className="text-[72px] sm:text-[80px] font-normal text-slate-900/10 leading-none select-none">
                  01
                </span>

                <h3 className="mt-3 text-[18px] font-semibold text-slate-900">
                  Free Snapshot
                </h3>

                <p className="mt-3 text-[16px] text-slate-500 leading-relaxed font-normal">
                  First-pass public registry signal. Get instant automated
                  insights.
                </p>

                <p className="mt-5 text-[15px] font-semibold text-slate-900">
                  Free
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={80}>
              <div className="relative">
                <span className="text-[72px] sm:text-[80px] font-normal text-slate-900/10 leading-none select-none">
                  02
                </span>

                <h3 className="mt-3 text-[18px] font-semibold text-slate-900">
                  Pre-Feasibility Report
                </h3>

                <p className="mt-3 text-[16px] text-slate-500 leading-relaxed font-normal">
                  Analyst-led decision memo before formal feasibility.
                </p>

                <p className="mt-5 text-[15px] font-medium text-slate-600">
                  Fixed fee{" "}
                  <span className="text-slate-400 font-normal">
                    after scope
                  </span>
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={160}>
              <div className="relative">
                <span className="text-[72px] sm:text-[80px] font-normal text-slate-900/10 leading-none select-none">
                  03
                </span>

                <h3 className="mt-3 text-[18px] font-semibold text-slate-900">
                  RFP Harmonization
                </h3>

                <p className="mt-3 text-[16px] text-slate-500 leading-relaxed font-normal">
                  CRO/vendor proposal comparison before signature.
                </p>

                <p className="mt-5 text-[15px] font-medium text-slate-600">
                  Fixed fee{" "}
                  <span className="text-slate-400 font-normal">
                    after review
                  </span>
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={240}>
              <div className="relative">
                <span className="text-[72px] sm:text-[80px] font-normal text-slate-900/10 leading-none select-none">
                  04
                </span>

                <h3 className="mt-3 text-[18px] font-semibold text-slate-900">
                  Custom Support
                </h3>

                <p className="mt-3 text-[16px] text-slate-500 leading-relaxed font-normal">
                  For complex planning questions and protocol design.
                </p>

                <p className="mt-5 text-[15px] font-medium text-slate-600">
                  Custom quote
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section
        id="snapshot"
        className="py-20 sm:py-28 lg:py-36 bg-white scroll-mt-12"
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mb-14 sm:mb-20 text-center">
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-4">
                Free Tool
              </p>

              <h2 className="text-[32px] sm:text-[42px] lg:text-[50px] font-normal text-slate-900 leading-tight tracking-tight">
                Generate Your Free Snapshot
              </h2>

              <p className="mt-5 text-[17px] text-slate-500 max-w-xl mx-auto font-normal leading-relaxed">
                Enter your trial parameters below to receive an instant analysis
                of the current landscape.
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
                    The snapshot shows visible activity in structured public
                    registry data. It can help you see whether your indication
                    and geography look crowded, thin, sponsor-heavy or worth
                    deeper review.
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
                    It does not show actual site enrollment performance,
                    investigator capacity, contract timelines, coordinator
                    availability, or operational readiness. These require formal
                    feasibility work.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST SECTION */}
      <section
        className="relative overflow-hidden bg-[#f7f7f3] border-t border-[#deded8] py-24 sm:py-32 lg:py-36"
        style={dotGridBg}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/60 to-transparent" />

        <div className="relative mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.22em] text-slate-400 mb-4">
                In Development
              </p>

              <h2 className="text-[32px] sm:text-[42px] lg:text-[50px] font-normal text-slate-900 leading-tight tracking-tight">
                Coming Next:
                <br className="hidden sm:block" /> DCT Operations Dashboard
              </h2>

              <p className="mt-5 text-[17px] text-slate-500 max-w-lg mx-auto font-normal leading-relaxed">
                Miterion is developing selected modules for decentralized and
                hybrid clinical trial operations. Join the waitlist for early
                access.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={120} y={20}>
            <div className="mt-12 max-w-md mx-auto">
              <DctWaitlistForm />
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
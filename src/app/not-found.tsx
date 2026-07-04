import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import RevealOnScroll from "@/components/RevealOnScroll";

const dotGridBg = {
  backgroundImage:
    "radial-gradient(circle, #d9d9d4 1.1px, transparent 1.1px)",
  backgroundSize: "24px 24px",
};

export default function NotFound() {
  return (
    <section
      className="relative overflow-hidden border-b border-[#deded8] bg-[#f7f7f3] py-20 sm:py-28 lg:py-36"
      style={dotGridBg}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/65 to-transparent" />

      <div className="relative mx-auto max-w-[1200px] px-4 text-center sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mx-auto max-w-[860px]">
            <p className="mb-5 text-[13px] font-medium uppercase tracking-[0.22em] text-slate-500">
              404 · Page not found
            </p>

            <h1 className="flex flex-col text-[38px] font-normal leading-[1.04] tracking-tight text-slate-900 sm:text-[52px] lg:text-[64px]">
              <span>This page does not exist.</span>
              <span className="text-slate-400">
                But the decision risk still does.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-[660px] text-[17px] font-normal leading-relaxed text-slate-500 sm:text-[18px]">
              The page you are looking for may have moved, expired, or never
              existed. Return to Miterion and continue with clinical operations
              intelligence before expensive feasibility, country or vendor
              decisions.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/" className="inline-block">
                <Button
                  size="lg"
                  className="min-h-[50px] rounded-full bg-slate-900 px-8 text-[15px] font-medium text-white transition-all duration-300 hover:scale-[1.015] hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.98]"
                >
                  Back to homepage
                </Button>
              </Link>

              <Link href="/#snapshot" className="inline-block">
                <Button
                  size="lg"
                  className="gap-2 min-h-[50px] rounded-full bg-slate-900 px-8 text-[15px] font-medium text-white transition-all duration-300 hover:scale-[1.015] hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.98]"
                >
                  Generate Free Snapshot <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link
                href="/#solutions"
                className="inline-flex min-h-[50px] items-center justify-center rounded-full border border-[#deded8] bg-white/80 px-7 text-[15px] font-medium text-slate-700 transition-all hover:border-[#cfcfc7] hover:bg-white"
              >
                View analytical paths
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={140} y={24}>
          <div className="mx-auto mt-14 grid max-w-[980px] gap-5 text-left lg:grid-cols-3">
            <Link
              href="/#snapshot"
              className="group rounded-2xl border border-[#deded8] bg-white p-6 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] sm:p-7"
            >
              <div className="mb-7 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Search className="h-5 w-5" />
                </div>

                <span className="text-[13px] font-medium text-slate-400">
                  01
                </span>
              </div>

              <h2 className="text-[19px] font-semibold tracking-tight text-slate-900">
                Clinical Landscape Snapshot
              </h2>

              <p className="mt-3 text-[15px] font-normal leading-relaxed text-slate-500">
                Free first-pass view of visible clinical trial activity in your
                indication, phase and geography.
              </p>

              <div className="mt-8 border-t border-[#e6e6df] pt-5">
                <span className="flex items-center gap-1 text-[14px] font-medium text-slate-900 transition-colors group-hover:text-slate-600">
                  Generate Snapshot <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

            <Link
              href="/#solutions"
              className="group rounded-2xl border border-[#deded8] bg-white p-6 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] sm:p-7"
            >
              <div className="mb-7 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <FileText className="h-5 w-5" />
                </div>

                <span className="text-[13px] font-medium text-slate-400">
                  02
                </span>
              </div>

              <h2 className="text-[19px] font-semibold tracking-tight text-slate-900">
                Pre-Feasibility Decision Report
              </h2>

              <p className="mt-3 text-[15px] font-normal leading-relaxed text-slate-500">
                Analyst-led decision memo before formal feasibility, country
                selection or vendor commitment.
              </p>

              <div className="mt-8 border-t border-[#e6e6df] pt-5">
                <span className="flex items-center gap-1 text-[14px] font-medium text-slate-900 transition-colors group-hover:text-slate-600">
                  View Report Path <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>

            <Link
              href="/#solutions"
              className="group rounded-2xl border border-[#deded8] bg-white p-6 transition-all duration-300 hover:border-[#cfcfc7] hover:shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] sm:p-7"
            >
              <div className="mb-7 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <span className="text-[13px] font-medium text-slate-400">
                  03
                </span>
              </div>

              <h2 className="text-[19px] font-semibold tracking-tight text-slate-900">
                RFP & Budget Harmonization
              </h2>

              <p className="mt-3 text-[15px] font-normal leading-relaxed text-slate-500">
                Normalize CRO and vendor proposals before you choose a partner
                or sign the budget.
              </p>

              <div className="mt-8 border-t border-[#e6e6df] pt-5">
                <span className="flex items-center gap-1 text-[14px] font-medium text-slate-900 transition-colors group-hover:text-slate-600">
                  View Harmonization Path{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
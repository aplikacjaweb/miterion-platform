import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#deded8] bg-[#f7f7f3]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-[15px] font-semibold tracking-tight text-slate-900"
            >
              Miterion Platform
            </Link>

            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-slate-500">
              Clinical operations intelligence for feasibility, trial planning,
              country strategy and vendor decision support.
            </p>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Platform
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/#snapshot"
                className="text-[14px] text-slate-500 transition-colors hover:text-slate-900"
              >
                Free Snapshot
              </Link>

              {/* POPRAWIONO: Zmiana kotwicy z #solutions na #starting-points */}
              <Link
                href="/#starting-points"
                className="text-[14px] text-slate-500 transition-colors hover:text-slate-900"
              >
                Analytical paths
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Legal
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/privacy"
                className="text-[14px] text-slate-500 transition-colors hover:text-slate-900"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-[14px] text-slate-500 transition-colors hover:text-slate-900"
              >
                Terms and Conditions
              </Link>

              <Link
                href="/cookies"
                className="text-[14px] text-slate-500 transition-colors hover:text-slate-900"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Contact
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <a
                href="mailto:contact@miterion.com"
                className="text-[14px] text-slate-500 transition-colors hover:text-slate-900"
              >
                contact@miterion.com
              </a>
            </div>
          </div>
        </div>

        {/* Dolny pasek informacyjny z dodanym "Made in EU" */}
        <div className="mt-10 grid grid-cols-1 gap-3 border-t border-[#deded8] pt-6 text-[13px] text-slate-400 sm:grid-cols-3 items-center">
          <p className="text-left order-1 sm:order-none">
            © {year} Miterion. All rights reserved.
          </p>

          <p className="text-center order-3 sm:order-none text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400/85 select-none">
            Made in EU
          </p>

          <p className="text-left sm:text-right order-2 sm:order-none">
            Trial intelligence before expensive decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
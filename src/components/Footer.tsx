import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#deded8] bg-[#f7f7f3]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
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

              <Link
                href="/#solutions"
                className="text-[14px] text-slate-500 transition-colors hover:text-slate-900"
              >
                Analytical paths
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

        <div className="mt-10 flex flex-col gap-3 border-t border-[#deded8] pt-6 text-[13px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Miterion. All rights reserved.</p>

          <p>Trial intelligence before expensive decisions.</p>
        </div>
      </div>
    </footer>
  );
}
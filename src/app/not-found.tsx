import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-[#f7f7f3]">
      <section className="mx-auto flex max-w-[1200px] flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center rounded-full border border-[#deded8] bg-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-slate-500 shadow-sm">
          404 · Page not found
        </div>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          This page does not exist.
        </h1>

        <p className="mt-6 max-w-2xl text-[17px] leading-8 text-slate-600">
          The page you are looking for may have moved, expired, or never existed.
          You can return to Miterion and continue with clinical trial intelligence
          before expensive feasibility, country or vendor decisions.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-md bg-slate-950 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Back to homepage
          </Link>

          <Link
            href="/#snapshot"
            className="inline-flex h-12 items-center justify-center rounded-md border border-[#deded8] bg-white px-6 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
          >
            Generate free snapshot
          </Link>

          <Link
            href="/#solutions"
            className="inline-flex h-12 items-center justify-center rounded-md border border-[#deded8] bg-white px-6 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
          >
            View analytical paths
          </Link>
        </div>

        <div className="mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#deded8] bg-white p-5 text-left shadow-sm">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">
              01
            </p>
            <h2 className="mt-3 text-base font-semibold text-slate-950">
              Clinical Landscape Snapshot
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Free first-pass signal from visible public trial activity.
            </p>
          </div>

          <div className="rounded-2xl border border-[#deded8] bg-white p-5 text-left shadow-sm">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">
              02
            </p>
            <h2 className="mt-3 text-base font-semibold text-slate-950">
              Pre-Feasibility Decision Report
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Analyst-led review before formal feasibility and country selection.
            </p>
          </div>

          <div className="rounded-2xl border border-[#deded8] bg-white p-5 text-left shadow-sm">
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">
              03
            </p>
            <h2 className="mt-3 text-base font-semibold text-slate-950">
              RFP & Budget Harmonization
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Normalize CRO/vendor proposals before signing.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
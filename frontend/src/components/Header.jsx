function Header() {
  return (
    <div className="text-center mb-8 md:mb-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
        ResumeScore
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        ATS Clarity
      </div>
      <h1 className="mt-3 md:mt-4 text-3xl md:text-5xl font-semibold tracking-tight text-slate-900">
        Get a hiring-ready resume in minutes
      </h1>
      <p className="text-slate-600 mt-2 md:mt-3 text-sm md:text-lg">
        Analyze resume-job fit with ATS-style scoring and skill gap guidance.
      </p>
      <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-slate-500 mt-3">
        Score smarter. Hire faster.
      </p>
      <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-2 md:gap-3 text-[11px] md:text-sm">
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600">
          Trusted by bootcamp grads
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600">
          Role-aware scoring
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600">
          Instant skill feedback
        </div>
      </div>
    </div>
  );
}

export default Header;

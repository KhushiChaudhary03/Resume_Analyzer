function UploadForm({ setResume, jd, setJd, onAnalyze, loading, error }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Step 1
        </p>
        <label className="mt-3 block text-sm font-medium text-slate-800">
          Upload Resume (PDF)
        </label>
        <div className="mt-3 flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
          <input
            type="file"
            accept=".pdf"
            className="w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
            onChange={(e) => setResume(e.target.files[0])}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Step 2
        </p>
        <label className="mt-3 block text-sm font-medium text-slate-800">
          Job Description
        </label>
        <textarea
          rows="7"
          placeholder="Paste the job description here..."
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-100"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Role-Aware Analysis
          </p>
          <p className="mt-2 text-sm text-slate-600">
            We auto-detect the job role from your description to match the right
            skill pack.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
              Backend
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
              Frontend
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
              Data Science
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
              DevOps
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
              General
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={loading}
        className="w-full rounded-2xl bg-slate-900 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Analyzing Resume..." : "Analyze Resume"}
      </button>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 text-center font-medium">
          {error}
        </div>
      )}
    </div>
  );
}

export default UploadForm;

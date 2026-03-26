import { useRef, useState } from "react";

export default function UploadSection({ resume, setResume, jd, setJd, jobTitle, setJobTitle, onAnalyze, loading, error }) {
  const fileRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") setResume(file);
  };

  return (
    <div className="space-y-4 reveal">

      {/* Job title */}
      <div className="rounded-3xl border border-white/90 bg-white/80 backdrop-blur p-5 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
          Position Title
        </label>
        <input
          type="text"
          placeholder="e.g. Senior React Developer"
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100 transition"
        />
      </div>

      {/* Resume upload */}
      <div className="rounded-3xl border border-white/90 bg-white/80 backdrop-blur p-5 shadow-sm">
        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">
          Resume (PDF)
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-amber-400 bg-amber-50"
              : resume
              ? "border-emerald-400/60 bg-emerald-50/60"
              : "border-slate-300 hover:border-amber-400 hover:bg-amber-50/40"
          }`}
        >
          <input ref={fileRef} type="file" accept=".pdf" className="sr-only" onChange={e => setResume(e.target.files[0])} />
          {resume ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{resume.name}</p>
                <p className="text-xs text-emerald-600 font-semibold">Ready · click to change</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-600">Drop your PDF here</p>
              <p className="text-xs text-slate-400 mt-1">or click to browse files</p>
            </div>
          )}
        </div>
      </div>

      {/* Job description */}
      <div className="rounded-3xl border border-white/90 bg-white/80 backdrop-blur p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Job Description
          </label>
          <span className={`text-xs font-semibold transition-colors ${jd.length > 200 ? "text-emerald-600" : "text-slate-400"}`}>
            {jd.length} chars
          </span>
        </div>
        <textarea
          rows={8}
          placeholder="Paste the full job description here for best results..."
          value={jd}
          onChange={e => setJd(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100 transition resize-none"
        />
        {/* Role pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mr-1">Auto-detects:</span>
          {["Backend", "Frontend", "Data Science", "DevOps", "General"].map(r => (
            <span key={r} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-semibold text-center">
          ⚠ {error}
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={onAnalyze}
        disabled={loading}
        className="w-full rounded-2xl py-4 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          boxShadow: "0 8px 32px -8px rgba(15,23,42,0.45)"
        }}
        onMouseEnter={e => !loading && (e.target.style.background = "linear-gradient(135deg, #1e293b, #334155)")}
        onMouseLeave={e => !loading && (e.target.style.background = "linear-gradient(135deg, #0f172a, #1e293b)")}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Analyzing Resume...
          </span>
        ) : "⚡ Analyze Resume"}
      </button>
    </div>
  );
}

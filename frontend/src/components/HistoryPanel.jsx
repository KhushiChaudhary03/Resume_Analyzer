const ROLE_LABELS = {
  general: "General", backend: "Backend", frontend: "Frontend",
  data_science: "Data Science", devops: "DevOps",
};

const ROLE_COLORS = {
  general:      "bg-slate-100 text-slate-600 border-slate-200",
  backend:      "bg-blue-50 text-blue-700 border-blue-200",
  frontend:     "bg-violet-50 text-violet-700 border-violet-200",
  data_science: "bg-teal-50 text-teal-700 border-teal-200",
  devops:       "bg-orange-50 text-orange-700 border-orange-200",
};

function ScorePill({ label, value }) {
  const color =
    value >= 75 ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
    value >= 50 ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <div className="text-center">
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${color}`}>
        {Math.round(value)}%
      </span>
    </div>
  );
}

// Skeleton loader card
function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/90 bg-white/80 p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-4 bg-slate-200 rounded-full w-16" />
        <div className="h-3 bg-slate-100 rounded-full w-24" />
      </div>
      <div className="h-5 bg-slate-200 rounded-full w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2 mb-4" />
      <div className="h-3 bg-slate-100 rounded-full w-full mb-1" />
      <div className="h-3 bg-slate-100 rounded-full w-4/5 mb-4" />
      <div className="h-10 bg-slate-100 rounded-2xl mb-3" />
      <div className="h-9 bg-slate-100 rounded-xl" />
    </div>
  );
}

export default function HistoryPanel({ history, loading, onView, onDelete }) {

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // Empty state
  if (history.length === 0) {
    return (
      <div className="rounded-[28px] border border-white/90 bg-white/80 backdrop-blur p-16 text-center shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-600">No history yet</h3>
        <p className="text-slate-400 text-sm mt-1">Your past analyses will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
        {history.length} saved · last 20 analyses
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 reveal">
        {history.map(entry => {
          const date      = new Date(entry.created_at);
          const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          const time      = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

          return (
            <div key={entry.id}
              className="rounded-3xl border border-white/90 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all lift">

              {/* Header */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${ROLE_COLORS[entry.role] || ROLE_COLORS.general}`}>
                  {ROLE_LABELS[entry.role] || "General"}
                </span>
                <span className="text-xs text-slate-400">{formatted} · {time}</span>
              </div>

              {/* Title & file */}
              <h3 className="font-bold text-slate-900 truncate">{entry.job_title}</h3>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{entry.filename}</p>

              {/* JD snippet */}
              {entry.jd_snippet && (
                <p className="text-xs text-slate-400 mt-2 italic line-clamp-2 leading-relaxed border-l-2 border-slate-200 pl-2">
                  "{entry.jd_snippet}..."
                </p>
              )}

              {/* Score row */}
              <div className="flex items-center gap-4 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <ScorePill label="ATS"   value={entry.ats_score} />
                <div className="w-px h-8 bg-slate-200" />
                <ScorePill label="Skill" value={entry.skill_match_score} />
                <div className="flex-1 ml-1">
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${Math.min(entry.ats_score, 100)}%`, transition: "width 0.8s ease" }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => onView(entry)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white text-xs font-bold uppercase tracking-wider text-slate-700 py-2.5 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all shadow-sm"
                >
                  View Results
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="rounded-xl border border-slate-200 bg-white text-xs font-semibold px-4 py-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

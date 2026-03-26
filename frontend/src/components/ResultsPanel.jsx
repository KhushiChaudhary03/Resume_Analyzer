import { useState } from "react";

const ROLE_LABELS = {
  general: "General", backend: "Backend Engineering",
  frontend: "Frontend Engineering", data_science: "Data Science", devops: "DevOps",
};

const STRENGTH = {
  "Strong Match":   { text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200", bar: "#10b981", dot: "bg-emerald-500" },
  "Moderate Match": { text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200",   bar: "#f59e0b", dot: "bg-amber-500"   },
  "Weak Match":     { text: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-200",  bar: "#f97316", dot: "bg-orange-500"  },
  "Poor Match":     { text: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-200",    bar: "#f43f5e", dot: "bg-rose-500"    },
};

const SCORE_COLORS = {
  amber: { stroke: "#f59e0b", text: "text-amber-600", bg: "bg-amber-50",  border: "border-amber-200",  bar: "bg-amber-500",  track: "bg-amber-100" },
  teal:  { stroke: "#0d9488", text: "text-teal-600",  bg: "bg-teal-50",   border: "border-teal-200",   bar: "bg-teal-500",   track: "bg-teal-100"  },
  rose:  { stroke: "#f43f5e", text: "text-rose-600",  bg: "bg-rose-50",   border: "border-rose-200",   bar: "bg-rose-500",   track: "bg-rose-100"  },
};

function ScoreRing({ value, label, color }) {
  const c = SCORE_COLORS[color];
  const r = 34; const circ = 2 * Math.PI * r;
  const dash = Math.min(value, 100) / 100 * circ;
  return (
    <div className={`flex-1 rounded-2xl border ${c.border} ${c.bg} p-4 flex flex-col items-center gap-2 lift`}>
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
          <circle cx="40" cy="40" r={r} fill="none"
            stroke={c.stroke} strokeWidth="7"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className="score-ring-fill"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-black ${c.text}`}>{Math.round(value)}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase">%</span>
        </div>
      </div>
      <span className="text-xs font-bold text-slate-600 text-center leading-tight">{label}</span>
    </div>
  );
}

export default function ResultsPanel({ result, jobTitle }) {
  const [tab, setTab] = useState("overview");
  const {
    role = "general", strength = "Moderate Match",
    text_similarity_score = 0, skill_match_score = 0, ats_score = 0,
    matched_skills = [], missing_skills = [], improvement_tips = [],
    total_skills_in_pack = 0,
  } = result;

  const cfg = STRENGTH[strength] || STRENGTH["Moderate Match"];
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "skills",   label: `Skills (${matched_skills.length}/${total_skills_in_pack})` },
    { id: "gaps",     label: `Gaps (${missing_skills.length})` },
    { id: "tips",     label: "Tips" },
  ];

  return (
    <div className="rounded-[28px] border border-white/90 bg-white/85 backdrop-blur shadow-[0_8px_40px_-20px_rgba(15,23,42,0.15)] overflow-hidden" style={{animation:"fadein 500ms ease both"}}>

      {/* Header band */}
      <div className={`${cfg.bg} border-b ${cfg.border} px-6 py-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Analysis Complete</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{jobTitle || "Resume Fit Report"}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <div className={`flex items-center gap-1.5 font-bold text-sm ${cfg.text}`}>
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`}></span>
                {strength}
              </div>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">{ROLE_LABELS[role] || "General"} role detected</span>
            </div>
          </div>
          {/* ATS badge */}
          <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} px-5 py-3 text-center`}>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">ATS Score</p>
            <p className={`text-4xl font-black mt-0.5 ${cfg.text}`}>{Math.round(ats_score)}</p>
          </div>
        </div>
      </div>

      {/* Score rings */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex gap-3">
          <ScoreRing value={text_similarity_score} label="Text Similarity" color="amber" />
          <ScoreRing value={skill_match_score}     label="Skill Match"     color="teal"  />
          <ScoreRing value={ats_score}             label="ATS Score"       color="rose"  />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-4 overflow-x-auto gap-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 -mb-px transition-all ${
              tab === t.id
                ? "border-amber-500 text-amber-700"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Score Breakdown</h3>
            {[
              { label: "ATS Score",       value: ats_score,             desc: "Overall ATS compatibility",       color: "rose"  },
              { label: "Skill Match",     value: skill_match_score,     desc: "Skills from JD found in resume",  color: "teal"  },
              { label: "Text Similarity", value: text_similarity_score, desc: "Keyword & phrase overlap",        color: "amber" },
            ].map(({ label, value, desc, color }) => {
              const c = SCORE_COLORS[color];
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{label}</span>
                      <span className="text-xs text-slate-400">{desc}</span>
                    </div>
                    <span className={`text-sm font-black ${c.text}`}>{Math.round(value)}%</span>
                  </div>
                  <div className={`h-2.5 ${c.track} rounded-full overflow-hidden`}>
                    <div className={`h-full ${c.bar} rounded-full transition-all duration-1000`}
                         style={{ width: `${Math.min(value, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {tab === "skills" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Matched Skills</h3>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                {matched_skills.length} matched
              </span>
            </div>
            {matched_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matched_skills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-700">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">No matched skills. Try a more detailed job description.</p>
            )}
          </div>
        )}

        {/* Gaps */}
        {tab === "gaps" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Missing Skills</h3>
              <span className="text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full">
                {missing_skills.length} missing
              </span>
            </div>
            {missing_skills.length > 0 ? (
              <>
                {/* High priority */}
                <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-2">High Priority</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {missing_skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-sm font-semibold text-rose-700">
                      + {skill}
                    </span>
                  ))}
                </div>
                {/* Recommended */}
                {missing_skills.length > 3 && (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Recommended</p>
                    <div className="flex flex-wrap gap-2">
                      {missing_skills.slice(3).map((skill, i) => (
                        <span key={i} className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-8 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-3xl">🎉</span>
                <p className="text-sm font-bold text-emerald-700 mt-2">No skill gaps detected!</p>
                <p className="text-xs text-emerald-600 mt-1">Your resume matches all required skills for this role.</p>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        {tab === "tips" && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Improvement Tips</h3>
            {improvement_tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 lift">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs flex items-center justify-center font-black mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
              </div>
            ))}
            {improvement_tips.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No tips available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

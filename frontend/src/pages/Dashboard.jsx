import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UploadSection from "../components/UploadSection";
import ResultsPanel from "../components/ResultsPanel";
import HistoryPanel from "../components/HistoryPanel";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user, authFetch } = useAuth();
  const [resume, setResume]       = useState(null);
  const [jd, setJd]               = useState("");
  const [jobTitle, setJobTitle]   = useState("");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [history, setHistory]     = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [stats, setStats]         = useState(null);
  const [activeTab, setActiveTab] = useState("analyze");

  useEffect(() => {
    loadHistory();
    loadStats();
  }, []);

  const loadHistory = async () => {
    setHistoryLoading(true);
    const res = await authFetch("/history");
    if (res.ok) setHistory(await res.json());
    setHistoryLoading(false);
  };

  const loadStats = async () => {
    const res = await authFetch("/stats");
    if (res.ok) setStats(await res.json());
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    // Validations
    if (!resume) {
      setError("Please upload a resume PDF.");
      return;
    }
    if (resume.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (resume.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }
    if (!jobTitle.trim()) {
      setError("Please enter a position title.");
      return;
    }
    if (!jd.trim()) {
      setError("Please paste a job description.");
      return;
    }
    if (jd.trim().length < 50) {
      setError("Job description is too short. Please paste the full JD.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jd);
    formData.append("job_title", jobTitle);

    try {
      setLoading(true);
      const res  = await authFetch("/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      loadHistory();
      loadStats();
      setActiveTab("analyze");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = async (entry) => {
    const res = await authFetch(`/history/${entry.id}`);
    if (res.ok) {
      const data = await res.json();
      setResult(data.result);
      setJobTitle(data.job_title);
      setJd(data.jd_text || "");
      setResume(null);
      setActiveTab("analyze");
    }
  };

  const handleDeleteHistory = async (id) => {
    await authFetch(`/history/${id}`, { method: "DELETE" });
    loadHistory();
    loadStats();
  };

  return (
    <div className="min-h-screen bg-stone-100 relative overflow-hidden">

      {/* Animated blobs */}
      <div className="blob blob-amber w-96 h-96 bg-amber-200/40 -top-24 -left-32" style={{position:"fixed"}} />
      <div className="blob blob-teal w-[500px] h-[500px] bg-teal-200/30 top-1/2 -right-32" style={{position:"fixed"}} />
      <div className="blob blob-rose w-80 h-80 bg-rose-200/35 bottom-0 left-1/4" style={{position:"fixed"}} />

      <Navbar />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Welcome header */}
        <div className="reveal mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-3">
            ATS Clarity Engine
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Hey, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {user?.analyses_count
              ? `${user.analyses_count} analyse${user.analyses_count !== 1 ? "s" : ""} run — keep iterating!`
              : "Upload your resume and paste a JD to get your ATS score."}
          </p>
        </div>

        {/* Stats bar */}
        {stats && stats.total_analyses > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 reveal">
            {[
              { label: "Total Analyses",  value: stats.total_analyses,                icon: "📊" },
              { label: "Avg ATS Score",   value: `${stats.average_ats_score}%`,       icon: "🎯" },
              { label: "Best Score",      value: `${stats.best_ats_score}%`,          icon: "🏆" },
              { label: "Top Role",        value: stats.most_common_role,              icon: "💼" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-2xl border border-white/90 bg-white/70 backdrop-blur px-4 py-3.5 shadow-sm lift">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{icon}</span>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                </div>
                <p className="text-xl font-black text-slate-900 capitalize">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex items-center justify-end mb-6">
          <div className="flex rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-1.5 gap-1 shadow-sm">
            {["analyze", "history"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
                {tab === "history" && history.length > 0 && (
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"
                  }`}>
                    {history.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze tab */}
        {activeTab === "analyze" && (
          <div className="grid grid-cols-1 xl:grid-cols-[460px_1fr] gap-6">
            <UploadSection
              resume={resume}     setResume={setResume}
              jd={jd}             setJd={setJd}
              jobTitle={jobTitle} setJobTitle={setJobTitle}
              onAnalyze={handleAnalyze}
              loading={loading}   error={error}
            />
            <div>
              {result ? <ResultsPanel result={result} jobTitle={jobTitle} /> : <EmptyState />}
            </div>
          </div>
        )}

        {/* History tab */}
        {activeTab === "history" && (
          <HistoryPanel
            history={history}
            loading={historyLoading}
            onView={handleHistoryClick}
            onDelete={handleDeleteHistory}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[480px] rounded-[28px] border border-white/90 bg-white/60 backdrop-blur flex flex-col items-center justify-center text-center p-12 shadow-sm">
      <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mb-5 shadow-sm">
        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-700">Your results will appear here</h3>
      <p className="text-slate-400 text-sm mt-2 max-w-xs leading-relaxed">
        Upload your resume, paste a job description, and hit Analyze to get your instant ATS report.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["ATS Score", "Skill Match", "Gap Analysis", "Improvement Tips"].map(f => (
          <span key={f} className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">{f}</span>
        ))}
      </div>
    </div>
  );
}

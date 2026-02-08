import MatchSummary from "./MatchSummary";
import ScoreCard from "./ScoreCard";
import SkillSuggestions from "./SkillSuggestions";

function Results({ result }) {
  if (!result) return null;

  const {
    role = "general",
    text_similarity_score = 0,
    skill_match_score = 0,
    ats_score = 0,
    matched_skills = [],
    missing_skills = [],
  } = result;

  const roleMeta = {
    general: {
      label: "General",
      description: "Balanced scoring across core software skills.",
      matchedTitle: "Matched Skills",
      matchedCopy: "Skills aligned with this role’s requirements.",
    },
    backend: {
      label: "Backend Engineering",
      description: "APIs, data, and server-side delivery focused.",
      matchedTitle: "Matched Backend Skills",
      matchedCopy: "Server-side skills that match the backend requirements.",
    },
    frontend: {
      label: "Frontend Engineering",
      description: "UI, web, and client-side delivery focused.",
      matchedTitle: "Matched Frontend Skills",
      matchedCopy: "UI and web skills aligned with frontend expectations.",
    },
    data_science: {
      label: "Data Science",
      description: "ML, analytics, and research-focused skill pack.",
      matchedTitle: "Matched Data Science Skills",
      matchedCopy: "ML and analytics skills aligned with this role.",
    },
    devops: {
      label: "DevOps",
      description: "Infrastructure, CI/CD, and cloud readiness.",
      matchedTitle: "Matched DevOps Skills",
      matchedCopy: "Infrastructure and delivery skills aligned with DevOps.",
    },
  };

  const activeRole = roleMeta[role] || roleMeta.general;

  return (
    <div className="mt-12 md:mt-16">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Results
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Your resume fit report
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Review the score breakdown and polish your resume with targeted skills.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
            Detected Role
          </span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
            {activeRole.label}
          </span>
        </div>
      </div>

      <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-4 md:gap-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
            Role-Aware Analysis
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">
            {activeRole.label}
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            {activeRole.description}
          </p>
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Skills matched against {activeRole.label.toLowerCase()} pack
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <ScoreCard title="Text Similarity" value={text_similarity_score} color="amber" />
          <ScoreCard title="Skill Match" value={skill_match_score} color="teal" />
          <ScoreCard title="ATS Score" value={ats_score} color="rose" />
        </div>
      </div>

      <div className="mt-6">
        <MatchSummary skillScore={skill_match_score} missingSkills={missing_skills} />
      </div>

      <div className="mt-2 rounded-3xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-900">
              {activeRole.matchedTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {activeRole.matchedCopy}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {matched_skills.length} skills matched
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {matched_skills.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm"
            >
              {skill}
            </span>
          ))}
          {matched_skills.length === 0 && (
            <p className="text-sm text-slate-500">
              No matched skills yet. Try a more detailed job description.
            </p>
          )}
        </div>
      </div>

      <SkillSuggestions missingSkills={missing_skills} role={role} />
    </div>
  );
}

export default Results;

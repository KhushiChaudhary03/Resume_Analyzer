function SkillSuggestions({ missingSkills = [], role = "general" }) {
  const roleMeta = {
    general: {
      title: "Skill Gap Suggestions",
      copy: "Improve your ATS score by highlighting these skills on your resume.",
      emptyTitle: "No Skill Gaps",
      emptyCopy:
        "Your resume already meets all required skills for this role.",
    },
    backend: {
      title: "Backend Skill Gaps",
      copy: "Boost your backend readiness by adding these skills.",
      emptyTitle: "Backend Ready",
      emptyCopy:
        "Your resume already matches the core backend skill pack.",
    },
    frontend: {
      title: "Frontend Skill Gaps",
      copy: "Improve your frontend profile by highlighting these skills.",
      emptyTitle: "Frontend Ready",
      emptyCopy:
        "Your resume already matches the core frontend skill pack.",
    },
    data_science: {
      title: "Data Science Skill Gaps",
      copy: "Strengthen your ML and analytics coverage with these skills.",
      emptyTitle: "Data Science Ready",
      emptyCopy:
        "Your resume already matches the data science skill pack.",
    },
    devops: {
      title: "DevOps Skill Gaps",
      copy: "Level up your infrastructure readiness with these skills.",
      emptyTitle: "DevOps Ready",
      emptyCopy:
        "Your resume already matches the DevOps skill pack.",
    },
  };

  const meta = roleMeta[role] || roleMeta.general;

  if (missingSkills.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-emerald-700">
          {meta.emptyTitle}
        </h3>
        <p className="text-sm text-emerald-600 mt-2">
          {meta.emptyCopy}
        </p>
      </div>
    );
  }

  const highPriority = missingSkills.slice(0, 3);
  const lowPriority = missingSkills.slice(3);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">
          {meta.title}
        </h3>
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
          {missingSkills.length} skills missing
        </span>
      </div>

      <p className="text-sm text-slate-600 mt-3">
        {meta.copy}
      </p>

      <div className="mt-5">
        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 mb-2">
          High Priority
        </h4>
        <div className="flex flex-wrap gap-2">
          {highPriority.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {lowPriority.length > 0 && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">
            Recommended
          </h4>
          <div className="flex flex-wrap gap-2">
            {lowPriority.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-white text-slate-700 text-sm border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillSuggestions;

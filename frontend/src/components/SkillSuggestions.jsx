function SkillSuggestions({ missingSkills }) {
  if (!missingSkills || missingSkills.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-emerald-700">
          🎉 No Skill Gaps
        </h3>
        <p className="text-sm text-emerald-600 mt-2">
          Your resume already meets all the required skills for this role.
        </p>
      </div>
    );
  }

  // Simple priority rule
  const highPriority = missingSkills.slice(0, 3);
  const lowPriority = missingSkills.slice(3);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        📌 Skill Gap Suggestions
      </h3>

      <p className="text-sm text-slate-600 mb-4">
        Focus on these skills to improve your match for this role:
      </p>

      {/* High Priority */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-rose-600 mb-2">
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

      {/* Recommended */}
      {lowPriority.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-600 mb-2">
            Recommended
          </h4>
          <div className="flex flex-wrap gap-2">
            {lowPriority.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm"
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

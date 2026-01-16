import ScoreCard from "./ScoreCard";

function Results({ result }) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-slate-800 text-center mb-8">
        Analysis Results
      </h2>

      {/* Score cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <ScoreCard
          title="Text Similarity"
          value={result.text_similarity_score}
          color="indigo"
        />
        <ScoreCard
          title="Skill Match"
          value={result.skill_match_score}
          color="emerald"
        />
      </div>

      {/* Skills */}
      <div className="space-y-8">
        <div>
          <h3 className="font-semibold text-slate-700 mb-3">
            Matched Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.matched_skills.map((s, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm
                           hover:bg-emerald-200 transition"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-700 mb-3">
            Missing Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.map((s, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm
                           hover:bg-rose-200 transition"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;

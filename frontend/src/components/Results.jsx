import ScoreCard from "./ScoreCard";
import SkillSuggestions from "./SkillSuggestions";

function Results({ result }) {
  if (!result) return null;

  const {
    text_similarity_score = 0,
    skill_match_score = 0,
    ats_score = 0,
    matched_skills = [],
    missing_skills = [],
  } = result;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-slate-800 text-center mb-8">
        Analysis Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <ScoreCard title="Text Similarity" value={text_similarity_score} color="indigo" />
        <ScoreCard title="Skill Match" value={skill_match_score} color="emerald" />
        <ScoreCard title="ATS Score" value={ats_score} color="purple" />
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-slate-700 mb-3">Matched Skills</h3>
        <div className="flex flex-wrap gap-2">
          {matched_skills.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <SkillSuggestions missingSkills={missing_skills} />
    </div>
  );
}

export default Results;

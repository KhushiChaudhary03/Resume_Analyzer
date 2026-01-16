function MatchSummary({ skillScore, missingSkills }) {
  let status = "";
  let message = "";
  let bg = "";
  let text = "";

  if (skillScore >= 75) {
    status = "Strong Match";
    message =
      missingSkills.length === 0
        ? "Your resume matches all required skills for this role."
        : "Your resume matches most required skills. Minor improvements recommended.";
    bg = "bg-emerald-50";
    text = "text-emerald-700";
  } else if (skillScore >= 40) {
    status = "Moderate Match";
    message =
      "Your resume partially matches the job requirements. Consider improving missing skills.";
    bg = "bg-yellow-50";
    text = "text-yellow-700";
  } else {
    status = "Weak Match";
    message =
      "Your resume currently lacks many required skills for this role.";
    bg = "bg-rose-50";
    text = "text-rose-700";
  }

  return (
    <div className={`${bg} border border-slate-200 rounded-2xl p-6 mb-10`}>
      <h3 className={`text-xl font-bold ${text}`}>{status}</h3>
      <p className="text-slate-600 mt-2 text-sm">{message}</p>
    </div>
  );
}

export default MatchSummary;

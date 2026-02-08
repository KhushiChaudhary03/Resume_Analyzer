function ScoreCard({ title, value = 0, color = "amber" }) {
  const colors = {
    amber: {
      bg: "bg-amber-50",
      bar: "bg-amber-500",
      track: "bg-amber-200",
      text: "text-amber-700",
    },
    teal: {
      bg: "bg-teal-50",
      bar: "bg-teal-600",
      track: "bg-teal-200",
      text: "text-teal-700",
    },
    rose: {
      bg: "bg-rose-50",
      bar: "bg-rose-600",
      track: "bg-rose-200",
      text: "text-rose-700",
    },
  };

  const c = colors[color] || colors.indigo;

  return (
    <div className={`${c.bg} rounded-3xl p-6 shadow-sm border border-white`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <span className={`text-xs font-semibold ${c.text}`}>
          {value}%
        </span>
      </div>

      <div className={`mt-4 w-full ${c.track} h-2 rounded-full`}>
        <div
          className={`${c.bar} h-2 rounded-full`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>

      <p className="mt-4 text-2xl font-semibold text-slate-900">
        {Math.min(value, 100)} / 100
      </p>
    </div>
  );
}

export default ScoreCard;

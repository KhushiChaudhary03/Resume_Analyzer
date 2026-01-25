function ScoreCard({ title, value = 0, color = "indigo" }) {
  const colors = {
    indigo: {
      bg: "bg-indigo-50",
      bar: "bg-indigo-600",
      track: "bg-indigo-200",
      text: "text-indigo-700",
    },
    emerald: {
      bg: "bg-emerald-50",
      bar: "bg-emerald-600",
      track: "bg-emerald-200",
      text: "text-emerald-700",
    },
    purple: {
      bg: "bg-purple-50",
      bar: "bg-purple-600",
      track: "bg-purple-200",
      text: "text-purple-700",
    },
  };

  const c = colors[color] || colors.indigo;

  return (
    <div className={`${c.bg} rounded-2xl p-6 shadow-sm`}>
      <p className="text-sm font-medium text-slate-600 mb-3">
        {title}
      </p>

      <div className={`w-full ${c.track} h-2 rounded-full mb-3`}>
        <div
          className={`${c.bar} h-2 rounded-full`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>

      <p className={`text-2xl font-bold ${c.text}`}>
        {value}%
      </p>
    </div>
  );
}

export default ScoreCard;

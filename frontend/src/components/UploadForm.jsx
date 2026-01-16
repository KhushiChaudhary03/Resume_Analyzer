function UploadForm({ setResume, jd, setJd, onAnalyze, loading, error }) {
  return (
    <div className="space-y-8">
      {/* Resume */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Upload Resume (PDF)
        </label>
        <input
          type="file"
          accept=".pdf"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setResume(e.target.files[0])}
        />
      </div>

      {/* JD */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Job Description
        </label>
        <textarea
          rows="6"
          placeholder="Paste the job description here..."
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
      </div>

      {/* Button */}
      <button
        onClick={onAnalyze}
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 py-4 text-white font-semibold
                   hover:bg-indigo-700 transition-all duration-200
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing Resume..." : "Analyze Resume"}
      </button>

      {error && (
        <p className="text-rose-600 text-sm text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default UploadForm;

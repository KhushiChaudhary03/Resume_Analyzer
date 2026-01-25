import { useState } from "react";
import Header from "./components/Header";
import UploadForm from "./components/UploadForm";
import Results from "./components/Results";

function App() {
  const [resume, setResume] = useState(null);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!resume || !jd.trim()) {
      setError("Please upload a resume and paste a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jd", jd);

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setResult(data);
    } catch {
      setError("Failed to analyze resume. Backend not running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <Header />

          <UploadForm
            setResume={setResume}
            jd={jd}
            setJd={setJd}
            onAnalyze={handleAnalyze}
            loading={loading}
            error={error}
          />

          {result && <Results result={result} />}
        </div>
      </div>
    </div>
  );
}

export default App;

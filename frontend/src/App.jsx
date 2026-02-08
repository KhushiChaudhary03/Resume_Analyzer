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
    <div className="app">
      <div className="app-shell">
        <div className="app-blob app-blob-amber" />
        <div className="app-blob app-blob-teal" />
        <div className="app-blob app-blob-rose" />

        <div className="app-container">
          <div className="app-card">
            <div className="app-card-body app-reveal">
              <Header />

              <div className="app-grid">
                <div className="app-form">
                  <UploadForm
                    setResume={setResume}
                    jd={jd}
                    setJd={setJd}
                    onAnalyze={handleAnalyze}
                    loading={loading}
                    error={error}
                  />
                </div>

                <div className="app-sidebar">
                  <div className="app-panel">
                    <p className="app-panel-eyebrow">What you get</p>
                    <h3 className="app-panel-title">
                      A clear ATS readiness snapshot
                    </h3>
                    <p className="app-panel-copy">
                      Upload your resume and paste a job description. We score
                      the match, highlight strengths, and call out missing skills
                      so you can iterate fast.
                    </p>

                    <div className="app-panel-list">
                      <div className="app-panel-item">
                        <p className="app-panel-item-title">
                          Signal-rich metrics
                        </p>
                        <p className="app-panel-item-copy">
                          Text similarity, ATS score, and skill match.
                        </p>
                      </div>
                      <div className="app-panel-item">
                        <p className="app-panel-item-title">
                          Role-based scoring
                        </p>
                        <p className="app-panel-item-copy">
                          Backend, frontend, data science, DevOps, and general packs.
                        </p>
                      </div>
                      <div className="app-panel-item">
                        <p className="app-panel-item-title">
                          Skill gap plan
                        </p>
                        <p className="app-panel-item-copy">
                          Priority skills surfaced in minutes.
                        </p>
                      </div>
                      <div className="app-panel-item">
                        <p className="app-panel-item-title">
                          Clean reporting
                        </p>
                        <p className="app-panel-item-copy">
                          Built for quick resume updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {result && <Results result={result} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

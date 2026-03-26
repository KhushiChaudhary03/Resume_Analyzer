import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode]   = useState("login");
  const [form, setForm]   = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (mode === "register" && form.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return false;
    }
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (form.password.length > 128) {
      setError("Password is too long.");
      return false;
    }
    return true;
  };

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-stone-100 relative overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Animated blobs */}
      <div className="blob blob-amber w-96 h-96 bg-amber-200/60" style={{top:"-6rem", left:"-8rem"}} />
      <div className="blob blob-teal w-80 h-80 bg-teal-200/50" style={{top:"50%", right:"-5rem"}} />
      <div className="blob blob-rose w-72 h-72 bg-rose-200/50" style={{bottom:"0", left:"33%"}} />

      <div className="relative w-full max-w-md reveal">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-700 mb-4">
            ResumeIQ
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            ATS Clarity
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            {mode === "login"
              ? "Sign in to access your resume dashboard"
              : "Start analyzing resumes and beating the ATS"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[28px] border border-white/90 bg-white/85 backdrop-blur shadow-[0_24px_70px_-30px_rgba(15,23,42,0.2)] p-8">

          {/* Feature pills on register */}
          {mode === "register" && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {["ATS Scoring", "Skill Gap Analysis", "History Tracking"].map(f => (
                <span key={f} className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>
          )}

          <form onSubmit={handle} className="space-y-4" noValidate>

            {/* Name — register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100 transition"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"}
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-100 transition"
              />
              {/* Password strength indicator — register only */}
              {mode === "register" && form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                      form.password.length >= i * 3
                        ? i <= 1 ? "bg-rose-400"
                          : i <= 2 ? "bg-amber-400"
                          : i <= 3 ? "bg-teal-400"
                          : "bg-emerald-500"
                        : "bg-slate-200"
                    }`} />
                  ))}
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {form.password.length < 4 ? "Weak" : form.password.length < 8 ? "Fair" : form.password.length < 12 ? "Good" : "Strong"}
                  </span>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                boxShadow: "0 8px 24px -8px rgba(15,23,42,0.4)"
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </span>
              ) : mode === "login" ? "Sign In" : "Create Free Account"}
            </button>
          </form>

          {/* Switch mode */}
          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={switchMode}
              className="text-amber-600 font-bold hover:text-amber-700 transition"
            >
              {mode === "login" ? "Sign up free →" : "Sign in →"}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Free to use · No credit card required
        </p>
      </div>
    </div>
  );
}

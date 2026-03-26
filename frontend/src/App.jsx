import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function AppInner() {
  const { user, loading } = useAuth();
  const path = window.location.pathname;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 relative overflow-hidden flex items-center justify-center">
        <div className="blob w-96 h-96 bg-amber-200/50" style={{top:"-6rem",left:"-8rem"}} />
        <div className="blob w-80 h-80 bg-teal-200/40" style={{bottom:"0",right:"-5rem"}} />
        <div className="flex flex-col items-center gap-4 relative">
          <div
            className="w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center"
            style={{background:"linear-gradient(135deg,#f59e0b,#d97706)"}}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-amber-400"
                style={{animation:`bounce 1s ease-in-out ${i * 0.15}s infinite`}}
              />
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Loading ResumeIQ...</p>
        </div>
        <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      </div>
    );
  }

  // Simple path-based routing
  if (path !== "/" && path !== "") {
    return user ? <NotFound /> : <AuthPage />;
  }

  return user ? <Dashboard /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}


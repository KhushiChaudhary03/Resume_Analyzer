export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-100 relative overflow-hidden flex flex-col items-center justify-center text-center px-4">
      <div className="blob blob-amber w-96 h-96 bg-amber-200/40" style={{top:"-6rem",left:"-8rem"}} />
      <div className="blob blob-teal w-80 h-80 bg-teal-200/30" style={{bottom:"0",right:"-5rem"}} />

      <div className="relative reveal">
        <div className="w-20 h-20 rounded-3xl border border-white/90 bg-white/80 backdrop-blur flex items-center justify-center mx-auto mb-6 shadow-sm text-4xl">
          📄
        </div>
        <h1 className="text-7xl font-black text-slate-900 mb-3">404</h1>
        <p className="text-slate-500 text-lg mb-2">This page doesn't exist.</p>
        <p className="text-slate-400 text-sm mb-8">The page you're looking for may have been moved or deleted.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
          style={{background:"linear-gradient(135deg,#0f172a,#1e293b)", boxShadow:"0 8px 24px -8px rgba(15,23,42,0.4)"}}
        >
          ← Go Home
        </a>
      </div>
    </div>
  );
}

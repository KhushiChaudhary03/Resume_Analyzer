import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-sm shadow-slate-900/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
               style={{background: "linear-gradient(135deg, #f59e0b, #d97706)"}}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">ResumeIQ</span>
            <span className="hidden sm:inline ml-2 text-xs font-semibold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Beta</span>
          </div>
        </div>

        {/* Right side */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Analyses pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-semibold text-slate-600">
                {user.analyses_count || 0} analyses
              </span>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                     style={{background: "linear-gradient(135deg, #f59e0b, #d97706)"}}>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-700">{user.name?.split(" ")[0]}</span>
                <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {open && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-900/10 overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-4 border-b border-slate-100"
                         style={{background: "linear-gradient(135deg, #fffbeb, #fef3c7)"}}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow"
                             style={{background: "linear-gradient(135deg, #f59e0b, #d97706)"}}>
                          {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[140px]">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Analyses run</span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {user.analyses_count || 0}
                      </span>
                    </div>
                    {/* Sign out */}
                    <button
                      onClick={() => { setOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

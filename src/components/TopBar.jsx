import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

function TopBar({ activePage }) {
  const { user, signOut, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  const pageTitles = {
    dashboard: 'Dashboard',
    students: 'Students',
    timetable: 'Timetable',
    tasks: 'Tasks',
    resources: 'Resources',
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-14 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60 flex items-center px-4 lg:px-5 gap-3">
      <div className="flex items-center gap-2 text-sm min-w-0">
        <span className="text-slate-500 hidden sm:inline">Class Hub</span>
        <svg className="w-3 h-3 text-slate-700 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white font-medium truncate text-sm">
          {pageTitles[activePage] || 'Page'}
        </span>
      </div>

      <div className="flex-1" />

      <NotificationBell />

      <div className="relative" ref={ref}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 p-0.5 rounded-full hover:bg-slate-900 transition"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 text-[11px] font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden animate-scale-in origin-top-right">
            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Signed in as</p>
              <p className="text-xs text-white font-medium truncate">{user?.email}</p>
              <div className="mt-2">
                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                }`}>
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
              </div>
            </div>
            <button
              onClick={() => { setMenuOpen(false); signOut(); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default TopBar;
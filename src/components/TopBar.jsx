import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

function TopBar({ activePage, onMenuClick }) {
  const { user, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  const titles = {
    home: 'Dashboard',
    timetable: 'Timetable',
    members: 'Class Members',
    tasks: 'Tasks',
    resources: 'Resources',
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-[#0a120a]/85 backdrop-blur-xl border-b border-green-900/30 px-4 md:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden text-green-300 hover:text-white p-1 -ml-1"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-white leading-tight truncate">
            {titles[activePage] || 'Dashboard'}
          </h1>
          <p className="text-[10px] md:text-[11px] text-green-500 truncate">
            ICT(6)26S M1-C • TERM III 2026
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <NotificationBell />

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/30 border border-green-800/40 text-[11px] text-green-300">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          Live
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white font-bold text-sm flex items-center justify-center border border-green-400/30 hover:border-green-400/60 transition"
            aria-label="User menu"
          >
            {user?.email?.charAt(0).toUpperCase()}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-[#0d1a0d]/95 backdrop-blur-xl border border-green-900/50 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-green-900/40">
                <p className="text-[10px] text-green-500 uppercase tracking-wide mb-1">
                  Signed in as
                </p>
                <p className="text-xs text-white font-medium truncate">{user?.email}</p>
                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}
                >
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
              </div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
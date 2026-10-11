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
    <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-[#e9e5ff] px-4 md:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-[#1e1b4b] p-1 -ml-1"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-[#1e1b4b] leading-tight truncate">
            {titles[activePage] || 'Dashboard'}
          </h1>
          <p className="text-[10px] md:text-[11px] text-gray-500 truncate">
            ICT(6)26S M1-C • TERM III 2026
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <NotificationBell />

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-[11px] text-violet-600 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
          Live
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 transition"
            aria-label="User menu"
          >
            {user?.email?.charAt(0).toUpperCase()}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-[#e9e5ff] rounded-2xl shadow-xl shadow-violet-500/10 overflow-hidden z-50">
              <div className="p-4 border-b border-[#e9e5ff]">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-semibold">
                  Signed in as
                </p>
                <p className="text-xs text-[#1e1b4b] font-medium truncate">{user?.email}</p>
                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'bg-violet-50 text-violet-600 border border-violet-200'
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
                className="w-full flex items-center gap-2 px-4 py-3 text-xs text-red-500 hover:bg-red-50 transition font-medium"
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
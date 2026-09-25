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
    <div className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu" onClick={onMenuClick} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="page-title">
          <h1>{titles[activePage] || 'Dashboard'}</h1>
          <p>ICT(6)26S M1-C • TERM III 2026</p>
        </div>
      </div>
      <div className="top-actions">
        <NotificationBell />
        <div className="live-pill">
          <span className="status-pulse"></span>
          Live · <b>just now</b>
        </div>
        <div className="user-menu" ref={ref}>
          <button
            className="user-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="User menu"
          >
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </button>
          {menuOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-head">
                <p>Signed in as</p>
                <strong>{user?.email}</strong>
                <span className={`user-dropdown-role ${isAdmin ? 'admin' : 'student'}`}>
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
              </div>
              <button onClick={() => { setMenuOpen(false); signOut(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';

function Sidebar({ activePage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Students' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'resources', label: 'Resources' }
  ];

  function handleNavigate(id) {
    onNavigate(id);
    setIsOpen(false);
  }

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white hover:bg-slate-800 transition"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full lg:h-auto
          w-64 bg-slate-900 border-r border-slate-800 p-4
          z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white transition"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start justify-between mb-8 mt-2 lg:mt-0">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Class Hub v2
            </h1>
            <p className="text-xs text-slate-500 mt-1">ICT(6)26S M1-C</p>
          </div>
          <NotificationBell />
        </div>

        <nav className="space-y-1">
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavigate(link.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                activePage === link.id
                  ? 'bg-gradient-to-r from-cyan-400/10 to-indigo-500/10 text-cyan-400 border border-cyan-400/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
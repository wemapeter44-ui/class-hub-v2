import { useEffect } from 'react';

function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const links = [
    { id: 'home', label: 'Dashboard', icon: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z' },
    { id: 'timetable', label: 'Timetable', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'members', label: 'Class Members', icon: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 1 8 0M20 8v6M23 11h-6' },
    { id: 'tasks', label: 'Tasks', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
    { id: 'resources', label: 'Resources', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
  ];

  function handleNavigate(id) {
    onNavigate(id);
    onClose();
  }

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.7)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 998,
            animation: 'fadeIn .2s ease',
          }}
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="logo">PD</div>
          <div className="brand-text">
            <strong>CLASS HUB</strong>
            <span>ICT(6)26S M1-C</span>
          </div>
        </div>
        <nav className="nav">
          {links.map(link => (
            <button
              key={link.id}
              className={activePage === link.id ? 'active' : ''}
              onClick={() => handleNavigate(link.id)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d={link.icon} />
              </svg>
              {link.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-pulse"></span>
          <span>Connected · Live sync</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
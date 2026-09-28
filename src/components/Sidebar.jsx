import { useAuth } from '../contexts/AuthContext';

function Sidebar({ activePage, onNavigate }) {
  const { signOut } = useAuth();

  const links = [
    { id: 'home', label: 'Dashboard', icon: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z' },
    { id: 'timetable', label: 'Timetable', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'members', label: 'Class Members', icon: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 1 8 0M20 8v6M23 11h-6' },
    { id: 'announcements', label: 'Announcements', icon: 'm3 11 18-5v12L3 14v-3z' },
    { id: 'tasks', label: 'Tasks', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
    { id: 'resources', label: 'Resources', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
  ];

  return (
    <aside className="w-64 bg-[#0b120b] border-r border-green-900/30 min-h-screen flex flex-col">
      <div className="p-5 border-b border-green-900/30 flex items-center gap-3">
        <img src="/kcnp-logo.png" alt="KCNP" className="w-11 h-11 object-contain" />
        <div>
          <h1 className="text-sm font-bold text-white leading-tight">CLASS HUB</h1>
          <p className="text-[10px] text-green-500 mt-0.5">KCNP</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(link => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${
              activePage === link.id
                ? 'bg-green-800/60 text-white'
                : 'text-green-200/80 hover:bg-green-900/30 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d={link.icon} />
            </svg>
            <span className="truncate">{link.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-green-900/30">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-red-400/90 hover:bg-red-500/10 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>

      <div className="px-4 py-2 text-[10px] text-green-800 text-center border-t border-green-900/30">
        © 2026 PDT Softwares
      </div>
    </aside>
  );
}

export default Sidebar;
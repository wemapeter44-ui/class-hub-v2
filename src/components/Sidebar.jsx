function Sidebar({ activePage, onNavigate }) {
  const links = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Students' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'resources', label: 'Resources' }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
          Class Hub v2
        </h1>
        <p className="text-xs text-slate-500 mt-1">ICT(6)26S M1-C</p>
      </div>

      <nav className="space-y-1">
        {links.map(link => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
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
  );
}

export default Sidebar;
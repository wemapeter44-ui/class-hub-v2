function BottomNav({ activePage, onNavigate }) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z',
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    },
    {
      id: 'members',
      label: 'Members',
      icon: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 1 8 0M20 8v6M23 11h-6',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-[#15102b] border-t border-[#e9e5ff] dark:border-[#2a2148] pb-[env(safe-area-inset-bottom)] transition-colors">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activePage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors"
              aria-label={tab.label}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? '#7c3aed' : (document.documentElement.classList.contains('dark') ? '#6b7280' : '#9ca3af')}
                strokeWidth={isActive ? '2.4' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}
              >
                <path d={tab.icon} />
              </svg>
              <span
                className={`text-[9px] font-medium ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
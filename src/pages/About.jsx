function About({ onBack }) {
  return (
    <div className="min-h-screen bg-[#f5f3ff] dark:bg-[#0b0918] pb-24 transition-colors">

      <div className="brand-gradient rounded-b-[2.5rem] pt-4 pb-10 px-5 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-2xl" />

        <button
          onClick={onBack}
          className="relative z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white active:scale-95 transition"
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="relative z-10 mt-6 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">About Us</h1>
            <p className="text-xs text-white/80 mt-0.5">Class Hub</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-3">

        <div className="surface p-5">
          <h2 className="text-sm font-bold text-[#1e1b4b] dark:text-[#f5f3ff] mb-2">What is Class Hub?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Class Hub is a digital platform that connects students and teachers in one place.
            It helps you view your timetable, share resources, track tasks, and stay in touch
            with class members — all in a single app.
          </p>
        </div>

        <div className="surface p-5">
          <h2 className="text-sm font-bold text-[#1e1b4b] dark:text-[#f5f3ff] mb-2">Features</h2>
          <ul className="space-y-2.5">
            {[
              { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', text: 'Daily live timetable' },
              { icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Tasks and assignment tracking' },
              { icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z', text: 'Shared learning resources' },
              { icon: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 1 8 0M20 8v6M23 11h-6', text: 'Class members directory' },
            ].map((f) => (
              <li key={f.text} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-300 flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-0.5">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-5">
          <h2 className="text-sm font-bold text-[#1e1b4b] dark:text-[#f5f3ff] mb-2">Developer</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Class Hub is designed and maintained by <span className="font-semibold text-violet-600 dark:text-violet-400">PDT Softwares</span> —
            a small team of developers building digital tools for students.
          </p>
        </div>

        <div className="surface p-5">
          <h2 className="text-sm font-bold text-[#1e1b4b] dark:text-[#f5f3ff] mb-2">Version</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Class Hub</span>
            <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 px-2.5 py-1 rounded-md">
              v2.0.0
            </span>
          </div>
        </div>

      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-8">© 2026 PDT Softwares</p>
    </div>
  );
}

export default About;
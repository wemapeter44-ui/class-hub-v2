function Privacy({ onBack }) {
  const sections = [
    { title: '1. What we collect', body: 'We collect your email (for login), your name (for your profile), registration number, and phone number — to identify you as a member of your class.' },
    { title: '2. How we use it', body: 'Your data is used to show your information in the app (your name in class members, your tasks, your resources). We never sell your data to anyone.' },
    { title: '3. Who can see your data', body: 'Class members can see your name, registration, and avatar. Only admins can add or remove records. Any other data remains private to you.' },
    { title: '4. Storage', body: 'All data is stored securely on Supabase servers. Your avatar is stored in a storage bucket — visible to anyone signed in to the app.' },
    { title: '5. Your rights', body: 'You can update your name, avatar, and sign out at any time. If you want your account fully deleted, contact your class admin.' },
    { title: '6. Cookies', body: 'We only use session storage for login. We do not use tracking or advertising cookies.' },
    { title: '7. Changes', body: 'If we update this policy, we will change the date at the bottom. Continuing to use the app means you accept the changes.' },
    { title: '8. Contact', body: 'For any privacy questions, reach out to PDT Softwares through your class admin.' },
  ];

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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Privacy Policy</h1>
            <p className="text-xs text-white/80 mt-0.5">Your data, your rights</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="surface p-5">
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            We wrote this policy in plain language to explain how Class Hub handles your data.
            By using this app, you accept the terms listed below.
          </p>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {sections.map((s) => (
          <div key={s.title} className="surface p-5">
            <h2 className="text-sm font-bold text-[#1e1b4b] dark:text-[#f5f3ff] mb-2">{s.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="px-4 mt-6">
        <div className="surface p-4 text-center">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">This policy was last updated</p>
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mt-1">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-6">© 2026 PDT Softwares</p>
    </div>
  );
}

export default Privacy;
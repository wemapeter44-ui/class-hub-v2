import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function Profile({ onBack, onNavigate }) {
  const { user, signOut, avatarUrl, uploadAvatar } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const fileRef = useRef(null);
  const [toast, setToast] = useState('');
  const [uploading, setUploading] = useState(false);

  const firstName = user?.email
    ? user.email.split('@')[0].split(/[._-]/)[0]
    : 'User';

  const initial = user?.email?.charAt(0).toUpperCase() || '?';

  function showToastMsg(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadAvatar(file);
      showToastMsg('Photo updated ✓');
    } catch (err) {
      showToastMsg(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] dark:bg-[#0b0918] pb-24 relative transition-colors">

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1e1b4b] dark:bg-[#15102b] text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg animate-fade-up border border-transparent dark:border-[#2a2148]">
          {toast}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="brand-gradient rounded-b-[2.5rem] pt-4 px-5 pb-24 relative overflow-hidden">
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

        <div className="relative z-10 mt-4 flex flex-col items-center">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="relative w-28 h-28 active:scale-95 transition disabled:opacity-70"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white/50 shadow-lg" />
            ) : (
              <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                {initial}
              </div>
            )}
            {uploading ? (
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              </div>
            ) : (
              <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-white flex items-center justify-center text-violet-600 shadow-md">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}
          </button>

          <h1 className="text-lg font-bold text-white mt-3 capitalize">{firstName}</h1>
          <p className="text-xs text-white/80 mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-1">

        {/* === DARK MODE TOGGLE === */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white dark:bg-[#15102b] border border-[#e9e5ff] dark:border-[#2a2148] text-left active:scale-[0.98] transition"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-300">
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </div>
          <span className="flex-1 text-sm font-medium text-[#1e1b4b] dark:text-[#f5f3ff]">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
          <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${theme === 'dark' ? 'bg-violet-600' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </button>

        {/* About */}
        <button
          onClick={() => onNavigate?.('about')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white dark:bg-[#15102b] border border-[#e9e5ff] dark:border-[#2a2148] text-left active:scale-[0.98] transition"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM12 16v-4M12 8h.01" />
            </svg>
          </div>
          <span className="flex-1 text-sm font-medium text-[#1e1b4b] dark:text-[#f5f3ff]">About Us</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Privacy */}
        <button
          onClick={() => onNavigate?.('privacy')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white dark:bg-[#15102b] border border-[#e9e5ff] dark:border-[#2a2148] text-left active:scale-[0.98] transition"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-300">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="flex-1 text-sm font-medium text-[#1e1b4b] dark:text-[#f5f3ff]">Privacy Policy</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400 dark:text-gray-500" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

      </div>

      <div className="px-4 mt-6">
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white dark:bg-[#15102b] border border-red-100 dark:border-red-500/20 text-red-500 active:scale-[0.98] transition text-sm font-semibold"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-6">© 2026 PDT Softwares</p>
    </div>
  );
}

export default Profile;
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

function AppHeader({ user, onAvatarClick }) {
  const { avatarUrl } = useAuth();

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Good morning'
    : now.getHours() < 17 ? 'Good afternoon'
    : 'Good evening';

  const firstName = user?.email
    ? user.email.split('@')[0].split(/[._-]/)[0]
    : 'there';

  const initial = user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="md:hidden relative">
      <div className="brand-gradient rounded-b-[2rem] px-5 pt-6 pb-16 relative overflow-hidden shadow-lg shadow-violet-500/20">
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-2xl" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">
              {greeting}
            </p>
            <h1 className="text-xl font-bold text-white mt-1 truncate capitalize">
              Hi, {firstName} 👋
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />

            <button
              onClick={onAvatarClick}
              className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white font-bold text-base hover:bg-white/30 active:scale-95 transition overflow-hidden"
              aria-label="Profile"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                initial
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppHeader;
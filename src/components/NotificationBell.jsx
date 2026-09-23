import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed left-64 top-16 w-80 max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-[100] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">
            <h3 className="font-semibold text-white text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto bg-slate-900">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`group px-4 py-3 border-b border-slate-800 last:border-b-0 hover:bg-slate-800/60 transition ${
                    !n.read ? 'bg-cyan-500/5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex-1 cursor-pointer min-w-0"
                      onClick={() => !n.read && markAsRead(n.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {!n.read && <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"></span>}
                        <p className="font-semibold text-white text-sm truncate">{n.title}</p>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed break-words">{n.message}</p>
                      <p className="text-slate-500 text-xs mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition flex-shrink-0"
                      aria-label="Delete notification"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
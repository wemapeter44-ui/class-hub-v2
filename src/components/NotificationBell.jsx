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
    if (!dateString) return '';
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
    <>
      <style>{`
        .bell-wrap { position: relative; }
        .bell-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-2);
          cursor: pointer;
          transition: all .18s ease;
        }
        .bell-btn:hover {
          border-color: rgba(34,211,238,.35);
          color: var(--accent);
        }
        .bell-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 10px;
          background: var(--danger);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          display: grid;
          place-items: center;
          box-shadow: 0 0 10px rgba(248,113,113,.6);
          border: 2px solid var(--bg);
        }
        .bell-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 340px;
          max-height: 420px;
          background: var(--surface);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          z-index: 200;
          animation: fadeUp .2s cubic-bezier(.16,1,.3,1);
          display: flex;
          flex-direction: column;
        }
        .bell-dropdown-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }
        .bell-dropdown-list {
          max-height: 340px;
          overflow-y: auto;
        }
        .bell-item {
          position: relative;
          padding: 13px 16px;
          border-bottom: 1px solid var(--border);
          transition: background .18s ease;
        }
        .bell-item:last-child { border-bottom: 0; }
        .bell-item.unread { background: rgba(34,211,238,.04); }
        .bell-item.unread:hover { background: rgba(34,211,238,.08); }
        .bell-item.read:hover { background: rgba(255,255,255,.03); }

        @media (max-width: 640px) {
          .bell-dropdown {
            position: fixed;
            top: 70px;
            left: 12px;
            right: 12px;
            width: auto;
            max-width: none;
            z-index: 1000;
          }
          .bell-dropdown-list {
            max-height: calc(100vh - 200px);
          }
        }
      `}</style>

      <div className="bell-wrap" ref={ref}>
        <button
          className="bell-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Notifications"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>

          {unreadCount > 0 && (
            <span className="bell-badge">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="bell-dropdown">
            <div className="bell-dropdown-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '-.2px' }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: 20,
                      background: 'rgba(34,211,238,.10)',
                      border: '1px solid rgba(34,211,238,.22)',
                      color: 'var(--accent)',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    fontSize: 11,
                    color: 'var(--accent)',
                    fontWeight: 600,
                    background: 'none',
                    border: 0,
                    cursor: 'pointer',
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="bell-dropdown-list">
              {notifications.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      margin: '0 auto 12px',
                      borderRadius: 12,
                      background: 'var(--gradient-soft)',
                      border: '1px solid rgba(34,211,238,.14)',
                      color: 'var(--muted)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`bell-item ${!n.read ? 'unread' : 'read'}`}
                    onClick={() => !n.read && markAsRead(n.id)}
                    style={{ cursor: !n.read ? 'pointer' : 'default' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          marginTop: 6,
                          flexShrink: 0,
                          background: !n.read ? 'var(--accent)' : 'var(--muted)',
                          boxShadow: !n.read ? '0 0 8px rgba(34,211,238,.6)' : 'none',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 12.5,
                            fontWeight: 700,
                            color: 'var(--text)',
                            marginBottom: 3,
                            letterSpacing: '-.1px',
                          }}
                        >
                          {n.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: 'var(--text-2)',
                            lineHeight: 1.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {n.message}
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 5, fontWeight: 500 }}>
                          {timeAgo(n.created_at)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n.id);
                        }}
                        style={{
                          color: 'var(--muted)',
                          background: 'none',
                          border: 0,
                          cursor: 'pointer',
                          padding: 4,
                          borderRadius: 6,
                          flexShrink: 0,
                          transition: 'all .18s ease',
                        }}
                        aria-label="Delete notification"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 18L18 6M6 6l12 12" />
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
    </>
  );
}

export default NotificationBell;
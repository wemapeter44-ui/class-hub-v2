import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNotifications() {
    console.log('[NOTIF] fetchNotifications called. User:', user?.id);

    if (!user) {
      console.log('[NOTIF] No user — clearing notifications');
      setNotifications([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    console.log('[NOTIF] Query result:', {
      userId: user.id,
      error,
      count: data?.length,
      data,
    });

    if (error) {
      console.error('[NOTIF] Error fetching notifications:', error);
      setLoading(false);
      return;
    }

    setNotifications(data || []);
    setLoading(false);
  }

  useEffect(() => {
    console.log('[NOTIF] useEffect triggered — user changed');
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    console.log('[NOTIF] Subscribing to realtime for user:', user.id);

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          console.log('[NOTIF] Realtime event:', payload);
          fetchNotifications();
        }
      )
      .subscribe((status) => {
        console.log('[NOTIF] Realtime status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function markAsRead(id) {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  async function markAllAsRead() {
    if (!user) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function deleteNotification(id) {
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  async function createNotification({ user_id, title, message }) {
    const { error } = await supabase
      .from('notifications')
      .insert([{ user_id, title, message, read: false }]);
    if (error) {
      console.error('[NOTIF] createNotification error:', error);
      return { error };
    }
    fetchNotifications();
    return { success: true };
  }

  async function createBroadcastNotification({ title, message }) {
    if (!user) return;
    const { data: users, error } = await supabase
      .from('user_roles')
      .select('user_id')
      .neq('user_id', user.id);
    if (error || !users || users.length === 0) return;
    const rows = users.map((u) => ({
      user_id: u.user_id,
      title,
      message,
      read: false,
    }));
    await supabase.from('notifications').insert(rows);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        createNotification,
        createBroadcastNotification,
        refresh: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
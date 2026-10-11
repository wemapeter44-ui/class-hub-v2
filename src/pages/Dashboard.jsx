import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState(0);
  const [tasks, setTasks] = useState(0);
  const [todayClasses, setTodayClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const MODULES = 7;
  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    async function load() {
      const [s, t, tt, an] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('timetable').select('*').eq('day', dayName),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(1),
      ]);
      setStudents(s.count || 0);
      setTasks(t.count || 0);
      setTodayClasses((tt.data || []).sort((a, b) => a.start_time.localeCompare(b.start_time)));
      setAnnouncements(an.data || []);
    }
    load();
  }, [dayName]);

  function getStatus(start, end) {
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = String(start).split(':').map(Number);
    const [eh, em] = String(end).split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    if (nowMin < startMin) return 'incoming';
    if (nowMin >= startMin && nowMin < endMin) return 'in-progress';
    return 'ended';
  }

  const statusStyle = {
    incoming: 'text-violet-600 bg-violet-50 border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/30',
    'in-progress': 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30',
    ended: 'text-gray-500 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-500/10 dark:border-gray-500/20',
  };

  const statusLabel = {
    incoming: 'Incoming',
    'in-progress': 'Live',
    ended: 'Ended',
  };

  const stats = [
    { label: 'Members', value: students, color: '#8b5cf6', bg: 'bg-violet-50 dark:bg-violet-500/15', iconColor: 'text-violet-600 dark:text-violet-300', icon: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 1 8 0M20 8v6M23 11h-6' },
    { label: 'Modules', value: MODULES, color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-500/15', iconColor: 'text-blue-600 dark:text-blue-300', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
    { label: 'Lessons', value: todayClasses.length, color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-500/15', iconColor: 'text-emerald-600 dark:text-emerald-300', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Tasks', value: tasks, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-500/15', iconColor: 'text-amber-600 dark:text-amber-300', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
  ];

  return (
    <div className="px-4 pb-4 pt-4 md:px-8 md:pt-6 max-w-3xl mx-auto">

      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="surface p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-gray-400 dark:text-gray-500">
                {s.label}
              </p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.bg} ${s.iconColor}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1e1b4b] dark:text-[#f5f3ff] tabular-nums leading-none">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#1e1b4b] dark:text-[#f5f3ff]">Class Overview</h2>
        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{dayName}</span>
      </div>

      {todayClasses.length === 0 ? (
        <div className="surface p-8 text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-500/15 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center mx-auto mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">No classes today</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enjoy your {dayName}</p>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {todayClasses.map((c) => {
            const status = getStatus(c.start_time, c.end_time);
            return (
              <div key={c.id} className="surface p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff] truncate">{c.unit}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 tabular-nums mt-0.5">
                      {c.start_time} – {c.end_time}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full border ${statusStyle[status]}`}>
                    {statusLabel[status]}
                  </span>
                </div>
                {(c.lecturer || c.room) && (
                  <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                    {c.lecturer && <span>{c.lecturer}</span>}
                    {c.room && <span>· {c.room}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {announcements.length > 0 && (
        <>
          <h2 className="text-sm font-bold text-[#1e1b4b] dark:text-[#f5f3ff] mb-3">Latest Announcement</h2>
          <div className="surface p-4 border-l-4 border-l-amber-400">
            <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">{announcements[0].title}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{announcements[0].message}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
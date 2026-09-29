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
  const greeting =
    now.getHours() < 12 ? 'Good morning'
    : now.getHours() < 17 ? 'Good afternoon'
    : 'Good evening';
  const today = now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
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
    incoming: 'text-green-400 bg-green-400/10 border-green-400/20',
    'in-progress': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20 animate-pulse',
    ended: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
  };

  const statusLabel = {
    incoming: 'Incoming',
    'in-progress': 'In Progress',
    ended: 'Ended',
  };

  const stats = [
    { label: 'Members', value: students, icon: 'users' },
    { label: 'Modules', value: MODULES, icon: 'book' },
    { label: 'Lessons', value: todayClasses.length, icon: 'calendar' },
    { label: 'Tasks', value: tasks, icon: 'check' },
  ];

  const iconPaths = {
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 8 0M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
    calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    check: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Welcome card */}
      <div className="relative overflow-hidden rounded-2xl border border-green-900/40 bg-gradient-to-br from-[#0d1a0d] via-[#0a120a] to-[#0a120a] p-6 md:p-8 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
            Class Hub
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-3 leading-tight">
            {greeting}, welcome back
          </h1>
          <p className="text-xs md:text-sm text-green-300/80 mt-2 max-w-lg leading-relaxed">
            Stay ahead with your timetable, tasks, announcements and curated learning resources — all in one place.
          </p>
          <p className="text-[11px] md:text-xs text-green-400 mt-3 font-medium">
            {today}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gradient-to-br from-[#0d1a0d] to-[#0a120a] border border-green-900/40 rounded-xl p-4 hover:border-green-700/60 transition relative"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] text-green-500 uppercase tracking-widest font-semibold">
                {s.label}
              </p>
              <div className="w-7 h-7 rounded-lg bg-green-900/40 border border-green-800/50 flex items-center justify-center text-green-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={iconPaths[s.icon]} />
                </svg>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white tabular-nums">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Class Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
            </svg>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Class Overview
            </h2>
          </div>
          <span className="text-[11px] text-green-500 font-medium">{dayName}</span>
        </div>

        {todayClasses.length === 0 ? (
          <div className="bg-[#0d1a0d] border border-green-900/30 rounded-xl p-10 text-center">
            <p className="text-sm text-green-500/70">No classes today</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayClasses.map((c) => {
              const status = getStatus(c.start_time, c.end_time);
              return (
                <div
                  key={c.id}
                  className="bg-[#0d1a0d] border border-green-900/30 rounded-xl p-4 hover:border-green-800/60 transition"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-baseline gap-3">
                      <p className="text-sm font-bold text-white tabular-nums">
                        {c.start_time}
                      </p>
                      <p className="text-[11px] text-green-600 tabular-nums">
                        {c.end_time}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">
                      {c.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap text-[11px] text-green-500/80 mb-3">
                    {c.lecturer && (
                      <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
                        </svg>
                        {c.lecturer}
                      </span>
                    )}
                    {c.room && (
                      <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        </svg>
                        {c.room}
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusStyle[status]}`}
                  >
                    {statusLabel[status]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Latest Announcement */}
      {announcements.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight mb-3">
            Latest Announcement
          </h2>
          <div className="bg-gradient-to-br from-[#0d1a0d] to-[#0a120a] border border-yellow-900/30 rounded-xl p-5">
            <p className="text-sm font-semibold text-white">
              {announcements[0].title}
            </p>
            <p className="text-sm text-green-300/90 mt-1 leading-relaxed">
              {announcements[0].message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
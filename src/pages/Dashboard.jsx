import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [students, setStudents] = useState(0);
  const [tasks, setStudentsTasks] = useState(0);
  const [resources, setResources] = useState(0);
  const [todayClasses, setTodayClasses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    async function load() {
      const [s, t, r, tt, an] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('timetable').select('*').eq('day', dayName),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(1),
      ]);
      setStudents(s.count || 0);
      setStudentsTasks(t.count || 0);
      setResources(r.count || 0);
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

  const statusLabel = { incoming: 'Incoming', 'in-progress': 'In Progress', ended: 'Ended' };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{greeting}</h1>
        <p className="text-sm text-green-400 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-5">
          <p className="text-[11px] text-green-500 uppercase tracking-wider font-semibold">Members</p>
          <p className="text-3xl font-bold text-white mt-2">{students}</p>
        </div>
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-5">
          <p className="text-[11px] text-green-500 uppercase tracking-wider font-semibold">Tasks</p>
          <p className="text-3xl font-bold text-white mt-2">{tasks}</p>
        </div>
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-5">
          <p className="text-[11px] text-green-500 uppercase tracking-wider font-semibold">Resources</p>
          <p className="text-3xl font-bold text-white mt-2">{resources}</p>
        </div>
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-5">
          <p className="text-[11px] text-green-500 uppercase tracking-wider font-semibold">Notifications</p>
          <p className="text-3xl font-bold text-white mt-2">{notifications.length}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
          <span>Today's Classes</span>
          <span className="text-[11px] text-green-500">{dayName}</span>
        </h2>

        {todayClasses.length === 0 ? (
          <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-8 text-center">
            <p className="text-sm text-green-500/70">No classes today</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayClasses.map(c => {
              const status = getStatus(c.start_time, c.end_time);
              return (
                <div key={c.id} className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-center flex-shrink-0">
                      <p className="text-sm font-bold text-white tabular-nums">{c.start_time}</p>
                      <p className="text-[10px] text-green-600 tabular-nums">{c.end_time}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{c.unit}</p>
                      <p className="text-[11px] text-green-500/80 truncate">
                        {c.lecturer}{c.room ? ' • ' + c.room : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex-shrink-0 ${statusStyle[status]}`}>
                    {statusLabel[status]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {announcements.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Latest Announcement</h2>
          <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-5">
            <p className="text-sm font-semibold text-white">{announcements[0].title}</p>
            <p className="text-sm text-green-300/90 mt-1">{announcements[0].message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
import { useState, useEffect } from 'react';
import { SkeletonStatCard } from '../components/Skeleton';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';

function Dashboard() {
  const [stats, setStats] = useState({ students: 0, tasks: 0, resources: 0 });
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    const [studentsRes, tasksRes, resourcesRes] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
      supabase.from('resources').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      students: studentsRes.count || 0,
      tasks: tasksRes.count || 0,
      resources: resourcesRes.count || 0,
    });

    setLoading(false);
  }

  async function fetchTodayClasses() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const { data } = await supabase
      .from('timetable')
      .select('*')
      .eq('day', today)
      .order('start_time', { ascending: true });

    setTodayClasses(data || []);
  }

  useEffect(() => {
    fetchStats();
    fetchTodayClasses();
  }, []);

  useRealtime('students', () => fetchStats());
  useRealtime('tasks', () => fetchStats());
  useRealtime('resources', () => fetchStats());
  useRealtime('timetable', () => fetchTodayClasses());

  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  function getClassStatus(lesson) {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const [startH, startM] = lesson.start_time.split(':').map(Number);
    const [endH, endM] = lesson.end_time.split(':').map(Number);
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;

    if (nowMinutes < startMin) return 'incoming';
    if (nowMinutes >= startMin && nowMinutes < endMin) return 'in-progress';
    return 'ended';
  }

  const cards = [
    { label: 'Members', value: stats.students, gradient: 'from-cyan-400 to-blue-500' },
    { label: 'Modules', value: 7, gradient: 'from-indigo-400 to-purple-500' },
    { label: 'Lessons', value: 15, gradient: 'from-green-400 to-emerald-500' },
    { label: 'Tasks', value: stats.tasks, gradient: 'from-amber-400 to-orange-500' },
    { label: 'Resources', value: stats.resources, gradient: 'from-pink-400 to-rose-500' },
  ];

  const statusConfig = {
    'incoming': { label: 'Incoming', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', dot: 'bg-cyan-400' },
    'in-progress': { label: 'In Progress', color: 'text-green-400 bg-green-400/10 border-green-400/20', dot: 'bg-green-400 animate-pulse' },
    'ended': { label: 'Ended', color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', dot: 'bg-slate-500' },
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-6 lg:p-8 animate-fade-up">
      {/* Page header */}
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-medium">Live</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-10">
        {loading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          cards.map(card => (
            <div
              key={card.label}
              className="group bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/80 hover:bg-slate-900 transition-colors duration-200"
            >
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-3">
                {card.label}
              </p>
              <p className={`text-3xl font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent tracking-tight`}>
                {card.value}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Today's classes */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-white">Today's Classes</h2>
          {todayClasses.length > 0 && (
            <span className="text-[11px] text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full font-medium">
              {todayClasses.length}
            </span>
          )}
        </div>
      </div>

      {todayClasses.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/20">
          <svg className="w-10 h-10 mx-auto mb-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-500">No classes scheduled for today</p>
          <p className="text-xs text-slate-600 mt-1">Check back tomorrow</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {todayClasses.map(lesson => {
            const status = getClassStatus(lesson);
            const config = statusConfig[status];

            return (
              <div
                key={lesson.id}
                className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/80 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-xs font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-md px-2 py-1 whitespace-nowrap">
                      {lesson.start_time} – {lesson.end_time}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ${config.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {config.label}
                  </div>
                </div>

                <div className="mb-2">
                  <h3 className="font-semibold text-white text-base">{lesson.unit}</h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{lesson.lecturer}</span>
                  {lesson.room && (
                    <>
                      <span className="text-slate-700">•</span>
                      <span className="text-indigo-400 font-medium">{lesson.room}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
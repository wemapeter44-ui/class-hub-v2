import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    tasks: 0,
    resources: 0,
  });
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

  useEffect(() => {
    fetchStats();
  }, []);

  // Realtime updates kwa tables zote 3
  useRealtime('students', () => fetchStats());
  useRealtime('tasks', () => fetchStats());
  useRealtime('resources', () => fetchStats());

  const cards = [
    {
      label: 'Members',
      value: stats.students,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      label: 'Modules',
      value: 7,
      color: 'from-indigo-400 to-purple-500',
    },
    {
      label: 'Lessons',
      value: 15,
      color: 'from-green-400 to-emerald-500',
    },
    {
      label: 'Tasks',
      value: stats.tasks,
      color: 'from-amber-400 to-orange-500',
    },
    {
      label: 'Resources',
      value: stats.resources,
      color: 'from-pink-400 to-rose-500',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-6">Welcome to your Class Hub</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(card => (
          <div
            key={card.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              {card.label}
            </p>
            <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
              {loading ? '...' : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">
          Welcome to Class Hub v2
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Your modern class portal. Access your timetable, students, tasks
          and resources all in one place.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
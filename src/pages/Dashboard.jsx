import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const [students, setStudents] = useState(0);
  const [tasks, setTasks] = useState(0);
  const [resources, setResources] = useState(0);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    async function load() {
      const [s, t, r] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }),
      ]);
      setStudents(s.count || 0);
      setTasks(t.count || 0);
      setResources(r.count || 0);
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{greeting}</h1>
        <p className="text-sm text-green-400 mt-1">{today}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0d1a0d] border border-green-900/40 rounded-lg p-5">
          <p className="text-[11px] text-green-400 uppercase tracking-wider font-semibold">Members</p>
          <p className="text-3xl font-bold text-white mt-2">{students}</p>
        </div>
        <div className="bg-[#0d1a0d] border border-green-900/40 rounded-lg p-5">
          <p className="text-[11px] text-green-400 uppercase tracking-wider font-semibold">Tasks</p>
          <p className="text-3xl font-bold text-white mt-2">{tasks}</p>
        </div>
        <div className="bg-[#0d1a0d] border border-green-900/40 rounded-lg p-5">
          <p className="text-[11px] text-green-400 uppercase tracking-wider font-semibold">Resources</p>
          <p className="text-3xl font-bold text-white mt-2">{resources}</p>
        </div>
        <div className="bg-[#0d1a0d] border border-green-900/40 rounded-lg p-5">
          <p className="text-[11px] text-green-400 uppercase tracking-wider font-semibold">Notifications</p>
          <p className="text-3xl font-bold text-white mt-2">{notifications.length}</p>
        </div>
      </div>

      <div className="bg-[#0d1a0d] border border-green-900/40 rounded-lg p-6">
        <h2 className="text-sm font-semibold text-white mb-3">Welcome to Class Hub</h2>
        <p className="text-sm text-green-300 leading-relaxed">
          Your class portal for ICT(6)26S M1-C. Access your timetable, tasks, announcements, and learning resources all in one place.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
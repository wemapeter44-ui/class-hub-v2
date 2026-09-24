import { useState, useEffect, useRef } from 'react';
import { SkeletonStatCard } from '../components/Skeleton';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';

function Dashboard() {
  const [stats, setStats] = useState({ students: 0, tasks: 0, resources: 0 });
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ students: [], tasks: [], resources: [] });
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

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

  // Search function
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ students: [], tasks: [], resources: [] });
      return;
    }

    const timer = setTimeout(async () => {
      const q = query.trim();

      const [studentsRes, tasksRes, resourcesRes] = await Promise.all([
        supabase.from('students').select('*').ilike('name', `%${q}%`).limit(5),
        supabase.from('tasks').select('*').ilike('title', `%${q}%`).limit(5),
        supabase.from('resources').select('*').ilike('title', `%${q}%`).limit(5),
      ]);

      setResults({
        students: studentsRes.data || [],
        tasks: tasksRes.data || [],
        resources: resourcesRes.data || [],
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    { label: 'Members', value: stats.students },
    { label: 'Modules', value: 7 },
    { label: 'Lessons', value: 15 },
    { label: 'Tasks', value: stats.tasks },
    { label: 'Resources', value: stats.resources },
  ];

  const statusConfig = {
    'incoming': { label: 'Incoming', color: 'text-slate-300 border-slate-600 bg-slate-800/50', dot: 'bg-slate-400' },
    'in-progress': { label: 'In Progress', color: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10', dot: 'bg-cyan-400 animate-pulse' },
    'ended': { label: 'Ended', color: 'text-slate-500 border-slate-700/60 bg-slate-900/50', dot: 'bg-slate-600' },
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const hasResults = results.students.length + results.tasks.length + results.resources.length > 0;
  const showDropdown = searchOpen && query.trim().length >= 2;

  return (
    <div className="p-5 lg:p-7 animate-fade-up">
      {/* Header with search */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
            <p className="text-xs lg:text-sm text-slate-500 mt-1">{today}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-medium hidden sm:inline">Live</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative" ref={searchRef}>
          <div className="relative">
            <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search students, tasks, resources..."
              className="w-full bg-slate-900/50 border border-slate-800/70 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults({ students: [], tasks: [], resources: [] }); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition p-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Results dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl overflow-hidden z-40 animate-scale-in origin-top max-h-96 overflow-y-auto">
              {!hasResults ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-slate-500">No results for "{query}"</p>
                </div>
              ) : (
                <>
                  {results.students.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-950/50">
                        Students ({results.students.length})
                      </div>
                      {results.students.map(s => (
                        <div key={s.id} className="px-3 py-2 hover:bg-slate-800/50 transition-colors border-b border-slate-800/40 last:border-b-0">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-[10px] font-bold flex-shrink-0">
                              {s.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-white truncate">{s.name}</p>
                              <p className="text-[10px] text-slate-500 truncate">{s.registration || 'No registration'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.tasks.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-950/50">
                        Tasks ({results.tasks.length})
                      </div>
                      {results.tasks.map(t => (
                        <div key={t.id} className="px-3 py-2 hover:bg-slate-800/50 transition-colors border-b border-slate-800/40 last:border-b-0">
                          <p className="text-xs font-medium text-white truncate">{t.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {t.unit && <span className="text-[10px] text-cyan-400">{t.unit}</span>}
                            {t.due_date && <span className="text-[10px] text-slate-500">Due {t.due_date}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.resources.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-950/50">
                        Resources ({results.resources.length})
                      </div>
                      {results.resources.map(r => (
                        <div key={r.id} className="px-3 py-2 hover:bg-slate-800/50 transition-colors border-b border-slate-800/40 last:border-b-0">
                          <p className="text-xs font-medium text-white truncate">{r.title}</p>
                          {r.unit && <p className="text-[10px] text-slate-500 mt-0.5">{r.unit}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5 mb-6">
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
              className="bg-slate-900/40 border border-slate-800/70 rounded-lg p-3.5 hover:border-slate-700/80 hover:bg-slate-900/70 transition-colors duration-200"
            >
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
                {card.label}
              </p>
              <p className="text-2xl lg:text-3xl font-semibold text-white tracking-tight tabular-nums">
                {card.value}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Today's classes */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm lg:text-base font-semibold text-white">Today's Classes</h2>
          {todayClasses.length > 0 && (
            <span className="text-[10px] text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-full font-medium tabular-nums">
              {todayClasses.length}
            </span>
          )}
        </div>
      </div>

      {todayClasses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800/80 rounded-lg bg-slate-900/20">
          <svg className="w-8 h-8 mx-auto mb-2 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-slate-500">No classes scheduled for today</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {todayClasses.map(lesson => {
            const status = getClassStatus(lesson);
            const config = statusConfig[status];

            return (
              <div
                key={lesson.id}
                className="bg-slate-900/40 border border-slate-800/70 rounded-lg p-3.5 hover:border-slate-700/80 hover:bg-slate-900/70 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="text-[11px] font-mono text-cyan-400 bg-cyan-400/5 border border-cyan-500/20 rounded px-1.5 py-0.5 whitespace-nowrap tabular-nums">
                    {lesson.start_time} – {lesson.end_time}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-semibold uppercase tracking-wider whitespace-nowrap ${config.color}`}>
                    <span className={`w-1 h-1 rounded-full ${config.dot}`} />
                    {config.label}
                  </div>
                </div>

                <h3 className="font-semibold text-white text-sm mb-1">{lesson.unit}</h3>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="truncate">{lesson.lecturer}</span>
                  {lesson.room && (
                    <>
                      <span className="text-slate-700">•</span>
                      <span className="text-slate-400 font-medium whitespace-nowrap">{lesson.room}</span>
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
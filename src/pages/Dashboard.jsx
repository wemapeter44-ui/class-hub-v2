import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';

const ICONS = {
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8L4 10.7l5.9 2L12 18.5l2.1-5.8L20 10.7l-6.1-1.9Z"/></svg>',
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatTime(v) {
  if (v === null || v === undefined || v === '') return '';
  const t = String(v).trim();
  const m = t.match(/(?:T|\s)(\d{1,2}:\d{2})(?::\d{2})?/);
  if (m) return m[1];
  const s = t.match(/^(\d{1,2}):\d{2}/);
  if (s) return s[1].padStart(2, '0') + ':' + t.split(':')[1].slice(0, 2);
  return t;
}

function timeToMinutes(t) {
  if (!t) return -1;
  const p = String(t).split(':');
  if (p.length < 2) return -1;
  return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
}

function Dashboard() {
  const [stats, setStats] = useState({ students: 0, tasks: 0, resources: 0 });
  const [todayClasses, setTodayClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    const [s, t, r] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
      supabase.from('resources').select('*', { count: 'exact', head: true }),
    ]);
    setStats({
      students: s.count || 0,
      tasks: t.count || 0,
      resources: r.count || 0,
    });
    setLoading(false);
  }

  async function fetchTodayClasses() {
    const today = DAYS[new Date().getDay()];
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

  function getStatus(lesson) {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const startMin = timeToMinutes(formatTime(lesson.start_time));
    const endMin = timeToMinutes(formatTime(lesson.end_time));
    if (nowMin < startMin) return 'incoming';
    if (nowMin >= startMin && nowMin < endMin) return 'in-progress';
    return 'ended';
  }

  const statusLabel = {
    incoming: 'Incoming',
    'in-progress': 'In Progress',
    ended: 'Ended',
  };

  const today = DAYS[new Date().getDay()];

  if (loading) {
    return (
      <>
        <div className="sk-row"><div className="sk sk-line"></div><div className="sk sk-line short"></div></div>
        <div className="sk-row"><div className="sk sk-line"></div><div className="sk sk-line short"></div></div>
      </>
    );
  }

  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <span className="eyebrow" dangerouslySetInnerHTML={{ __html: ICONS.spark + ' ICT Student Portal' }} />
          <h2>Welcome back to your class hub</h2>
          <p>Stay ahead with your timetable, tasks, announcements and curated learning resources — all in one place.</p>
        </div>
        <div className="hero-visual" dangerouslySetInnerHTML={{ __html: ICONS.book }} />
      </div>

      <div className="cards stagger-in">
        <div className="card">
          <div className="stat-head">
            <span className="stat-label">Members</span>
            <div className="stat-icon" dangerouslySetInnerHTML={{ __html: ICONS.user }} />
          </div>
          <div className="stat-number">{stats.students}</div>
        </div>
        <div className="card">
          <div className="stat-head">
            <span className="stat-label">Modules</span>
            <div className="stat-icon indigo" dangerouslySetInnerHTML={{ __html: ICONS.book }} />
          </div>
          <div className="stat-number">7</div>
        </div>
        <div className="card">
          <div className="stat-head">
            <span className="stat-label">Lessons</span>
            <div className="stat-icon green" dangerouslySetInnerHTML={{ __html: ICONS.calendar }} />
          </div>
          <div className="stat-number">{todayClasses.length}</div>
        </div>
        <div className="card">
          <div className="stat-head">
            <span className="stat-label">Tasks</span>
            <div className="stat-icon amber" dangerouslySetInnerHTML={{ __html: ICONS.check }} />
          </div>
          <div className="stat-number">{stats.tasks}</div>
        </div>
      </div>

      <div className="section-head">
        <h2 dangerouslySetInnerHTML={{ __html: ICONS.clock + ' Class Overview' }} />
        <span className="meta">{today}</span>
      </div>
      <div className="overview">
        {todayClasses.length === 0 ? (
          <div className="empty">
            <div className="empty-icon" dangerouslySetInnerHTML={{ __html: ICONS.calendar }} />
            <h4>No classes today</h4>
            <p>No lessons scheduled for {today}.</p>
          </div>
        ) : (
          todayClasses.map(lesson => {
            const state = getStatus(lesson);
            return (
              <div key={lesson.id} className={`class-row ${state}`}>
                <div className="class-time">
                  <div className="t-start">{formatTime(lesson.start_time)}</div>
                  <div className="t-end">{formatTime(lesson.end_time)}</div>
                </div>
                <div className="class-info">
                  <div className="c-unit">{lesson.unit}</div>
                  <div className="c-meta">
                    {lesson.lecturer && <span dangerouslySetInnerHTML={{ __html: ICONS.user + lesson.lecturer }} />}
                    {lesson.room && <span dangerouslySetInnerHTML={{ __html: ICONS.pin + lesson.room }} />}
                  </div>
                </div>
                <div className={`class-status ${state}`}>
                  <span className="st-dot"></span>
                  {statusLabel[state]}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default Dashboard;
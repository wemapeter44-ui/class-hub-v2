import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Monday');

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('timetable').select('*');
      setTimetable(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  function fmt(t) {
    if (!t) return '';
    const m = String(t).match(/(\d{1,2}:\d{2})/);
    return m ? m[1] : t;
  }

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const lessonsFor = (day) =>
    timetable.filter((l) => l.day === day && String(l.unit || '').trim() !== '');

  const activeLessons = lessonsFor(activeDay);

  return (
    <div className="px-4 pb-6 pt-4 md:px-8 md:pt-6 max-w-3xl mx-auto">

      <div className="mb-5">
        <h1 className="text-lg font-bold text-[#1e1b4b] dark:text-[#f5f3ff] tracking-tight">Timetable</h1>
        <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5 font-medium">Term III 2026</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1 scrollbar-hide">
        {days.map((day) => {
          const isActive = activeDay === day;
          const isToday = todayName === day;
          const count = lessonsFor(day).length;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all active:scale-95 ${
                isActive
                  ? 'brand-gradient text-white shadow-md shadow-violet-500/25'
                  : 'bg-white dark:bg-[#15102b] text-[#1e1b4b] dark:text-[#f5f3ff] border border-[#e9e5ff] dark:border-[#2a2148]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {day.slice(0, 3)}
                {isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-violet-500'}`} />
                )}
              </span>
              <span className={`block text-[9px] font-medium mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}`}>
                {count} {count === 1 ? 'lesson' : 'lessons'}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface p-4">
              <div className="flex gap-3">
                <div className="w-20 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/15 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-violet-100 dark:bg-violet-500/15 rounded animate-pulse w-2/3" />
                  <div className="h-2.5 bg-violet-50 dark:bg-violet-500/10 rounded animate-pulse w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : activeLessons.length === 0 ? (
        <div className="surface p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/15 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">No lessons on {activeDay}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enjoy your free day.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeLessons.map((l) => (
            <div key={l.id} className="surface p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <div className="w-16 py-2 rounded-xl bg-violet-50 dark:bg-violet-500/15 border border-violet-100 dark:border-violet-500/20 text-center">
                    <p className="text-[10px] font-bold text-violet-700 dark:text-violet-300 tabular-nums leading-tight">
                      {fmt(l.start_time)}
                    </p>
                    <p className="text-[9px] text-violet-400 dark:text-violet-400/70 tabular-nums leading-tight mt-0.5">
                      {fmt(l.end_time)}
                    </p>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff] truncate">{l.unit}</p>
                  {l.lecturer && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1 flex items-center gap-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
                      </svg>
                      {l.lecturer}
                    </p>
                  )}
                  {l.room && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-md px-2 py-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                      </svg>
                      {l.room}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Timetable;
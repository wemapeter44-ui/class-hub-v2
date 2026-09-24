import { useState, useEffect } from 'react';
import { SkeletonList } from '../components/Skeleton';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';
import { useToast } from '../contexts/ToastContext';

function Timetable() {
  const { showToast } = useToast();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTimetable() {
    const { data, error } = await supabase
      .from('timetable')
      .select('*')
      .order('day', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      showToast('Failed to load timetable', 'error');
      setLoading(false);
      return;
    }

    setTimetable(data);
    setLoading(false);
  }

  useEffect(() => { fetchTimetable(); }, []);

  useRealtime('timetable', () => fetchTimetable());

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="p-6 lg:p-8 animate-fade-up">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Timetable</h1>
          <p className="text-sm text-slate-500 mt-1">Term III 2026</p>
        </div>
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : timetable.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/20">
          <p className="text-sm text-slate-500">No timetable entries yet</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {days.map(day => {
            const lessons = timetable.filter(l => l.day === day);
            if (lessons.length === 0) return null;

            return (
              <div
                key={day}
                className="bg-slate-900/50 border border-slate-800/60 rounded-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/40">
                  <h2 className="font-semibold text-white text-sm">{day}</h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
                    {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="px-4 py-3 flex items-center gap-3 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded px-2 py-1 whitespace-nowrap flex-shrink-0">
                        {lesson.start_time}–{lesson.end_time}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm truncate">{lesson.unit}</div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">{lesson.lecturer}</div>
                      </div>
                      {lesson.room && (
                        <div className="text-[10px] font-semibold text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 rounded px-2 py-0.5 whitespace-nowrap flex-shrink-0">
                          {lesson.room}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Timetable;
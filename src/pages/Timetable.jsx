import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Timetable</h1>
        <p className="text-sm text-green-400 mt-1">Term III 2026</p>
      </div>

      {loading ? (
        <p className="text-green-400 text-sm">Loading...</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {days.map(day => {
            const lessons = timetable.filter(l => l.day === day && String(l.unit || '').trim() !== '');
            if (!lessons.length) return null;

            return (
              <div key={day} className="bg-[#0d1a0d] border border-green-900/30 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-green-900/30 bg-green-900/10 flex justify-between items-center">
                  <h2 className="font-semibold text-white text-sm">{day}</h2>
                  <span className="text-[10px] text-green-500 bg-green-900/30 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>
                <div className="divide-y divide-green-900/30">
                  {lessons.map(l => (
                    <div key={l.id} className="px-4 py-3 flex items-center gap-3">
                      <span className="text-[10px] font-mono text-green-400 bg-green-900/30 border border-green-900/50 rounded px-2 py-1 whitespace-nowrap">
                        {fmt(l.start_time)}–{fmt(l.end_time)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{l.unit}</p>
                        <p className="text-green-500/80 text-xs truncate mt-0.5">{l.lecturer}</p>
                      </div>
                      {l.room && (
                        <span className="text-[10px] text-yellow-500 bg-yellow-900/20 border border-yellow-900/40 rounded px-2 py-0.5 whitespace-nowrap">
                          {l.room}
                        </span>
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
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';
import { useToast } from '../contexts/ToastContext';

const ICONS = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
};

function formatTime(v) {
  if (!v) return '';
  const t = String(v).trim();
  const m = t.match(/(\d{1,2}:\d{2})/);
  return m ? m[1] : t;
}

function Timetable() {
  const { showToast } = useToast();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTimetable() {
    const { data, error } = await supabase
      .from('timetable').select('*')
      .order('day').order('start_time');
    if (error) { showToast('Failed to load timetable', 'error'); setLoading(false); return; }
    setTimetable(data);
    setLoading(false);
  }

  useEffect(() => { fetchTimetable(); }, []);
  useRealtime('timetable', () => fetchTimetable());

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <section className="section active">
      <div className="section-head">
        <h2>Class Timetable</h2>
        <span className="meta">Term III 2026</span>
      </div>

      {loading ? (
        <div className="sk-row"><div className="sk sk-line"></div><div className="sk sk-line short"></div></div>
      ) : timetable.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" dangerouslySetInnerHTML={{ __html: ICONS.calendar }} />
          <h4>No timetable yet</h4>
          <p>Once the admin publishes the timetable, lessons will appear here.</p>
        </div>
      ) : (
        <div className="timetable">
          {days.map(day => {
            const lessons = timetable.filter(l => l.day === day && String(l.unit || '').trim() !== '');
            if (lessons.length === 0) return null;
            return (
              <div key={day} className="day-card">
                <div className="day-header">
                  <span>{day}</span>
                  <span className="day-count">{lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}</span>
                </div>
                <div>
                  {lessons.map(lesson => {
                    const start = formatTime(lesson.start_time);
                    const end = formatTime(lesson.end_time);
                    return (
                      <div key={lesson.id} className="lesson">
                        <span className="time-chip" dangerouslySetInnerHTML={{ __html: ICONS.clock + start + (start && end ? ' – ' + end : '') }} />
                        <div>
                          <div className="unit-name">{lesson.unit}</div>
                          {lesson.lecturer && (
                            <div className="lecturer" dangerouslySetInnerHTML={{ __html: ICONS.user + lesson.lecturer }} />
                          )}
                        </div>
                        {lesson.room ? (
                          <span className="room-chip" dangerouslySetInnerHTML={{ __html: ICONS.pin + lesson.room }} />
                        ) : <span></span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Timetable;
import { initialTimetable } from '../data/timetable';

function Timetable() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Timetable</h1>
      <p className="text-slate-400 mb-6">Term III 2026</p>

      <div className="space-y-4">
        {days.map(day => {
          const lessons = initialTimetable.filter(l => l.day === day);

          if (lessons.length === 0) return null;

          return (
            <div
              key={day}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                <h2 className="font-semibold text-white">{day}</h2>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                  {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                </span>
              </div>

              <div>
                {lessons.map((lesson, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 border-b border-slate-800 last:border-b-0 flex items-center gap-4 hover:bg-slate-800/50 transition"
                  >
                    <div className="text-cyan-400 font-mono text-xs bg-cyan-400/10 border border-cyan-400/20 rounded px-2 py-1 whitespace-nowrap">
                      {lesson.start} – {lesson.end}
                    </div>

                    <div className="flex-1">
                      <div className="font-semibold text-white">{lesson.unit}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {lesson.lecturer}
                      </div>
                    </div>

                    {lesson.room && (
                      <div className="text-xs text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 rounded px-2 py-1">
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
    </div>
  );
}

export default Timetable;
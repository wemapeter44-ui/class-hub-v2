function Dashboard({ students }) {
  const totalStudents = students.length;
  const totalLessons = 15; // tutahesabu baadaye kutoka timetable
  const totalTasks = 0;

  const stats = [
    { label: 'Members', value: totalStudents, color: 'from-cyan-400 to-blue-500' },
    { label: 'Modules', value: 7, color: 'from-indigo-400 to-purple-500' },
    { label: 'Lessons', value: totalLessons, color: 'from-green-400 to-emerald-500' },
    { label: 'Tasks', value: totalTasks, color: 'from-amber-400 to-orange-500' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-6">Welcome to your Class Hub</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
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
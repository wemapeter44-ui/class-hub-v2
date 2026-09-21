import { useState } from 'react';
import { initialTasks } from '../data/tasks';

function Tasks({ tasks, setTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [unit, setUnit] = useState('');

  function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      unit: unit.trim(),
      status: 'Pending'
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
    setDueDate('');
    setUnit('');
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
      <p className="text-slate-400 mb-6">
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
      </p>

      <form onSubmit={addTask} className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <h2 className="font-semibold text-white mb-3">Add Task</h2>
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="Unit (e.g. CEI)"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-3 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No tasks yet. Add one above.
          </div>
        )}

        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{task.title}</h3>
                {task.description && (
                  <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {task.unit && (
                    <span className="text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded px-2 py-1">
                      {task.unit}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded px-2 py-1">
                      Due: {task.dueDate}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 bg-slate-800 rounded px-2 py-1">
                    {task.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-500/10 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
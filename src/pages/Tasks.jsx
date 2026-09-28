import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [unit, setUnit] = useState('');

  async function fetchTasks() {
    const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    setTasks(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchTasks(); }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await supabase.from('tasks').insert([{
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      unit: unit.trim(),
      status: 'Pending',
    }]);
    setTitle(''); setDescription(''); setDueDate(''); setUnit('');
    fetchTasks();
  }

  async function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    await supabase.from('tasks').delete().eq('id', id);
    fetchTasks();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Tasks</h1>
        <p className="text-sm text-green-400 mt-1">{tasks.length} tasks</p>
      </div>

      <form onSubmit={addTask} className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Add Task</h2>
        <div className="space-y-3">
          <input type="text" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
            className="w-full bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700 min-h-20" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
            <input type="text" placeholder="Unit (e.g. CEI)" value={unit} onChange={e => setUnit(e.target.value)}
              className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-green-800 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-md transition">
          Add Task
        </button>
      </form>

      {loading ? (
        <p className="text-green-400 text-sm">Loading...</p>
      ) : tasks.length === 0 ? (
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-8 text-center">
          <p className="text-sm text-green-500/70">No tasks yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(t => (
            <div key={t.id} className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-4 flex justify-between items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm">{t.title}</p>
                {t.description && <p className="text-green-300/80 text-xs mt-1">{t.description}</p>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {t.unit && <span className="text-[10px] text-green-400 bg-green-900/40 border border-green-900/50 rounded px-2 py-0.5 uppercase tracking-wide">{t.unit}</span>}
                  {t.due_date && <span className="text-[10px] text-yellow-400 bg-yellow-900/20 border border-yellow-900/40 rounded px-2 py-0.5">Due {t.due_date}</span>}
                  <span className="text-[10px] text-gray-400 bg-gray-900/40 border border-gray-800/50 rounded px-2 py-0.5">{t.status}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(t.id)} className="text-red-400 hover:text-red-300 text-xs flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';

function Tasks() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { createBroadcastNotification } = useNotifications();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [unit, setUnit] = useState('');

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      showToast('Failed to load tasks', 'error');
      setLoading(false);
      return;
    }
    setTasks(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const { error } = await supabase.from('tasks').insert([{
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      unit: unit.trim(),
      status: 'Pending',
    }]);

    if (error) {
      showToast('Error: ' + error.message, 'error');
      return;
    }

    await createBroadcastNotification({
      title: 'New task',
      message: `${title.trim()}${unit.trim() ? ' (' + unit.trim() + ')' : ''} imeongezwa.`,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setUnit('');
    showToast('Task added', 'success');
    fetchTasks();
  }

  async function deleteTask(id) {
    const task = tasks.find((t) => t.id === id);
    const ok = await confirm({
      title: 'Delete task?',
      message: 'This action cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;

    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      showToast('Failed to delete', 'error');
      return;
    }

    await createBroadcastNotification({
      title: 'Task removed',
      message: `${task?.title || 'A task'} imeondolewa.`,
    });

    showToast('Task deleted', 'success');
    fetchTasks();
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Tasks
          </h1>
          <p className="text-sm text-green-400 mt-1">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        {!isAdmin && (
          <span className="text-[10px] uppercase tracking-widest text-green-600 border border-green-900/50 px-2.5 py-1 rounded-full">
            View only
          </span>
        )}
      </div>

      {isAdmin && (
        <form
          onSubmit={addTask}
          className="bg-[#0d1a0d] border border-green-900/30 rounded-xl p-5 mb-6"
        >
          <h2 className="text-sm font-semibold text-white mb-4">Add Task</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-700"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-700 min-h-20"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700"
              />
              <input
                type="text"
                placeholder="Unit (e.g. CEI)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-700"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-700 hover:bg-green-600 text-white font-semibold text-sm px-4 py-2 rounded-md transition"
          >
            Add Task
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-green-400 text-sm">Loading...</p>
      ) : tasks.length === 0 ? (
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-xl p-10 text-center">
          <p className="text-sm text-green-500/70">No tasks yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="bg-[#0d1a0d] border border-green-900/30 rounded-xl p-4 flex justify-between items-start gap-3 hover:border-green-800/60 transition"
            >
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm">{t.title}</p>
                {t.description && (
                  <p className="text-green-300/80 text-xs mt-1 leading-relaxed">
                    {t.description}
                  </p>
                )}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {t.unit && (
                    <span className="text-[10px] text-green-400 bg-green-900/40 border border-green-900/50 rounded px-2 py-0.5 uppercase tracking-wide font-semibold">
                      {t.unit}
                    </span>
                  )}
                  {t.due_date && (
                    <span className="text-[10px] text-yellow-400 bg-yellow-900/20 border border-yellow-900/40 rounded px-2 py-0.5 font-medium">
                      Due {t.due_date}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 bg-gray-900/40 border border-gray-800/50 rounded px-2 py-0.5 font-medium">
                    {t.status}
                  </span>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-red-400 hover:text-red-300 text-xs flex-shrink-0 font-medium"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
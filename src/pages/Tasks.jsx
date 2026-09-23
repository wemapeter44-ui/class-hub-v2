import { useState, useEffect } from 'react';
import { SkeletonList } from '../components/Skeleton';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

function Tasks() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { createNotification } = useNotifications();
  const { user } = useAuth();
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
      console.error('Error fetching tasks:', error);
      showToast('Failed to load tasks', 'error');
      setLoading(false);
      return;
    }

    setTasks(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  useRealtime('tasks', () => {
    fetchTasks();
  });

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a title', 'warning');
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          due_date: dueDate,
          unit: unit.trim(),
          status: 'Pending'
        },
      ]);

    if (error) {
      console.error('Error adding task:', error);
      showToast('Failed to add: ' + error.message, 'error');
      return;
    }

    if (user) {
      await createNotification({
        user_id: user.id,
        title: 'Task Added',
        message: `New task: "${title.trim()}"${unit ? ' (' + unit.trim() + ')' : ''}`,
      });
    }

    setTitle('');
    setDescription('');
    setDueDate('');
    setUnit('');
    showToast('Task added successfully', 'success');
  }

  async function deleteTask(id) {
    const task = tasks.find(t => t.id === id);

    const confirmed = await confirm({
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      showToast('Failed to delete: ' + error.message, 'error');
      return;
    }

    if (user && task) {
      await createNotification({
        user_id: user.id,
        title: 'Task Deleted',
        message: `Task "${task.title}" has been removed.`,
      });
    }

    showToast('Task deleted', 'success');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Tasks</h1>
      <p className="text-slate-400 mb-6">
        {loading ? 'Loading...' : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}
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

      {loading ? (
        <SkeletonList count={3} />
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
          No tasks yet. Add one above.
        </div>
      ) : (
        <div className="space-y-3">
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
                    {task.due_date && (
                      <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded px-2 py-1">
                        Due: {task.due_date}
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
      )}
    </div>
  );
}

export default Tasks;
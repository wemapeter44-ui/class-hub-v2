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
  const [showForm, setShowForm] = useState(false);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load tasks', 'error'); setLoading(false); return; }
    setTasks(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchTasks(); }, []);

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

    if (error) { showToast('Error: ' + error.message, 'error'); return; }

    await createBroadcastNotification({
      title: 'New task',
      message: `${title.trim()}${unit.trim() ? ' (' + unit.trim() + ')' : ''} imeongezwa.`,
    });

    setTitle(''); setDescription(''); setDueDate(''); setUnit('');
    setShowForm(false);
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
    if (error) { showToast('Failed to delete', 'error'); return; }

    await createBroadcastNotification({
      title: 'Task removed',
      message: `${task?.title || 'A task'} imeondolewa.`,
    });

    showToast('Task deleted', 'success');
    fetchTasks();
  }

  const inputCls = 'peer w-full px-4 pt-6 pb-2 rounded-xl bg-[#faf9ff] dark:bg-[#1a1430] border border-[#e9e5ff] dark:border-[#2a2148] text-sm text-[#1e1b4b] dark:text-[#f5f3ff] focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-500/20 transition-all';

  const textareaCls = inputCls + ' min-h-24 resize-none';

  const floatLabel = 'absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-600 dark:peer-focus:text-violet-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider peer-[&:not(:placeholder-shown)]:text-violet-600 dark:peer-[&:not(:placeholder-shown)]:text-violet-400';

  const floatLabelArea = 'absolute left-4 top-4 text-sm text-gray-400 dark:text-gray-500 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-600 dark:peer-focus:text-violet-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider peer-[&:not(:placeholder-shown)]:text-violet-600 dark:peer-[&:not(:placeholder-shown)]:text-violet-400';

  function statusStyle(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'completed' || s === 'done') return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30';
    if (s === 'in progress' || s === 'in-progress') return 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30';
    return 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30';
  }

  return (
    <div className="px-4 pb-6 pt-4 md:px-8 md:pt-6 max-w-3xl mx-auto">

      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-lg font-bold text-[#1e1b4b] dark:text-[#f5f3ff] tracking-tight">Tasks</h1>
          <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5 font-medium">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        {isAdmin ? (
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl brand-gradient text-white text-xs font-semibold shadow-md shadow-violet-500/25 active:scale-95 transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 5v14M5 12h14'} />
            </svg>
            {showForm ? 'Cancel' : 'Add'}
          </button>
        ) : (
          <span className="text-[10px] uppercase tracking-widest text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 px-2.5 py-1 rounded-full font-semibold">
            View only
          </span>
        )}
      </div>

      {isAdmin && showForm && (
        <form onSubmit={addTask} className="surface p-5 mb-5 space-y-4 animate-fade-up">
          <h2 className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">Add Task</h2>

          <div className="relative">
            <input id="task-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder=" " className={inputCls} />
            <label htmlFor="task-title" className={floatLabel}>Task title</label>
          </div>

          <div className="relative">
            <textarea id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder=" " className={textareaCls} />
            <label htmlFor="task-desc" className={floatLabelArea}>Description</label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
              <label htmlFor="task-due" className="absolute left-4 top-2 text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 pointer-events-none">
                Due date
              </label>
            </div>
            <div className="relative">
              <input id="task-unit" type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder=" " className={inputCls} />
              <label htmlFor="task-unit" className={floatLabel}>Unit</label>
            </div>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md shadow-violet-500/25 active:scale-[0.97] transition">
            Add Task
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface p-4 space-y-2">
              <div className="h-3.5 bg-violet-100 dark:bg-violet-500/15 rounded animate-pulse w-2/3" />
              <div className="h-2.5 bg-violet-50 dark:bg-violet-500/10 rounded animate-pulse w-full" />
              <div className="flex gap-2 pt-1">
                <div className="h-5 w-14 bg-violet-50 dark:bg-violet-500/10 rounded animate-pulse" />
                <div className="h-5 w-20 bg-violet-50 dark:bg-violet-500/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="surface p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/15 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">No tasks yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin ? 'Add your first task to get started.' : 'Tasks will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="surface p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">{t.title}</p>
                  {t.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{t.description}</p>
                  )}
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {t.unit && (
                      <span className="text-[10px] text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-md px-2 py-0.5 uppercase tracking-wide font-semibold">
                        {t.unit}
                      </span>
                    )}
                    {t.due_date && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-md px-2 py-0.5 font-medium">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due {t.due_date}
                      </span>
                    )}
                    <span className={`text-[10px] rounded-md px-2 py-0.5 font-semibold border ${statusStyle(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => deleteTask(t.id)} className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-90 transition flex-shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tasks;
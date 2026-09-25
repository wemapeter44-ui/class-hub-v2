import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';

const ICONS = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
};

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
      .from('tasks').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load tasks', 'error'); setLoading(false); return; }
    setTasks(data);
    setLoading(false);
  }

  useEffect(() => { fetchTasks(); }, []);
  useRealtime('tasks', () => fetchTasks());

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return showToast('Enter task title', 'warning');
    const { error } = await supabase.from('tasks').insert([{
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      unit: unit.trim(),
      status: 'Pending',
    }]);
    if (error) return showToast('Failed: ' + error.message, 'error');

    await createBroadcastNotification({
      title: 'New Task',
      message: `${title.trim()}${dueDate ? ' — due ' + dueDate : ''}`,
    });

    setTitle(''); setDescription(''); setDueDate(''); setUnit('');
    showToast('Task added', 'success');
  }

  async function deleteTask(id) {
    const task = tasks.find(t => t.id === id);
    const ok = await confirm({ title: 'Delete Task', message: 'Are you sure?', confirmText: 'Delete', danger: true });
    if (!ok) return;
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return showToast('Failed: ' + error.message, 'error');

    if (task) {
      await createBroadcastNotification({
        title: 'Task Removed',
        message: `${task.title} has been removed.`,
      });
    }

    showToast('Task deleted', 'success');
  }

  return (
    <>
      <div className="section-head">
        <h2>Class Tasks</h2>
        <span className="meta">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
      </div>

      {isAdmin && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="section-head" style={{ marginBottom: 16 }}><h2>Add Task</h2></div>
          <form onSubmit={addTask}>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontSize: 13.5 }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Task details..."
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontSize: 13.5, minHeight: 80 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Due Date</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontSize: 13.5 }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Unit</label>
                  <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. CEI"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontSize: 13.5 }} />
                </div>
              </div>
            </div>
            <button type="submit"
              style={{ marginTop: 16, padding: '12px 18px', borderRadius: 11, background: 'var(--gradient)', color: '#04121a', fontWeight: 700, fontSize: 13, border: 0, cursor: 'pointer', boxShadow: '0 8px 22px -10px rgba(34,211,238,.55)' }}>
              Add Task
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="sk-row"><div className="sk sk-line"></div><div className="sk sk-line short"></div></div>
      ) : tasks.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" dangerouslySetInnerHTML={{ __html: ICONS.check }} />
          <h4>No tasks yet</h4>
          <p>Assigned tasks will show up here with their due dates.</p>
        </div>
      ) : (
        <div className="list">
          {tasks.map(task => {
            const status = String(task.status || 'Pending');
            const badgeCls = status.toLowerCase() === 'done' ? 'badge' : 'badge warning';
            return (
              <div key={task.id} className="list-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ paddingLeft: 8 }}>{task.title}</h3>
                    {task.description && <p style={{ paddingLeft: 8 }}>{task.description}</p>}
                    <div className="list-meta">
                      {task.unit && <span className="badge">{task.unit}</span>}
                      <span dangerouslySetInnerHTML={{ __html: ICONS.clock + 'Due: ' + (task.due_date || 'Not set') }} />
                      <span className={badgeCls}>{status}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      className="link-btn"
                      style={{ background: 'rgba(248,113,113,.10)', borderColor: 'rgba(248,113,113,.22)', color: 'var(--danger)', marginTop: 0, marginLeft: 0, padding: '6px 10px', fontSize: 11 }}
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Tasks;
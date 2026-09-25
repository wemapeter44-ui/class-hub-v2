import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';

const ICONS = {
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
};

function Resources() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { createBroadcastNotification } = useNotifications();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [unit, setUnit] = useState('');

  async function fetchResources() {
    const { data, error } = await supabase
      .from('resources').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load resources', 'error'); setLoading(false); return; }
    setResources(data);
    setLoading(false);
  }

  useEffect(() => { fetchResources(); }, []);
  useRealtime('resources', () => fetchResources());

  async function addResource(e) {
    e.preventDefault();
    if (!title.trim()) return showToast('Enter resource title', 'warning');
    const { error } = await supabase.from('resources').insert([{
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      unit: unit.trim(),
    }]);
    if (error) return showToast('Failed: ' + error.message, 'error');

    await createBroadcastNotification({
      title: 'New Resource',
      message: `${title.trim()}${unit ? ' — ' + unit : ''}`,
    });

    setTitle(''); setDescription(''); setLink(''); setUnit('');
    showToast('Resource added', 'success');
  }

  async function deleteResource(id) {
    const resource = resources.find(r => r.id === id);
    const ok = await confirm({ title: 'Delete Resource', message: 'Are you sure?', confirmText: 'Delete', danger: true });
    if (!ok) return;
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) return showToast('Failed: ' + error.message, 'error');

    if (resource) {
      await createBroadcastNotification({
        title: 'Resource Removed',
        message: `${resource.title} has been removed.`,
      });
    }

    showToast('Resource deleted', 'success');
  }

  return (
    <>
      <div className="section-head">
        <h2>Learning Resources</h2>
        <span className="meta">{resources.length} {resources.length === 1 ? 'resource' : 'resources'}</span>
      </div>

      {isAdmin && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="section-head" style={{ marginBottom: 16 }}><h2>Add Resource</h2></div>
          <form onSubmit={addResource}>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Resource title"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontSize: 13.5 }} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Description</label>
                <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', fontSize: 13.5 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Link</label>
                  <input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..."
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
              Add Resource
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="sk-row"><div className="sk sk-line"></div><div className="sk sk-line short"></div></div>
      ) : resources.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" dangerouslySetInnerHTML={{ __html: ICONS.book }} />
          <h4>No resources yet</h4>
          <p>Learning materials, links and notes will appear here.</p>
        </div>
      ) : (
        <div className="list">
          {resources.map(r => (
            <div key={r.id} className="list-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ paddingLeft: 8 }}>{r.title}</h3>
                  {r.description && <p style={{ paddingLeft: 8 }}>{r.description}</p>}
                  <div className="list-meta">
                    <span className="badge">{r.unit || 'General'}</span>
                  </div>
                  {r.link && (
                    <a className="link-btn" href={r.link} target="_blank" rel="noopener noreferrer"
                      dangerouslySetInnerHTML={{ __html: 'Open resource ' + ICONS.arrow }} />
                  )}
                </div>
                {isAdmin && (
                  <button
                    className="link-btn"
                    style={{ background: 'rgba(248,113,113,.10)', borderColor: 'rgba(248,113,113,.22)', color: 'var(--danger)', marginTop: 0, marginLeft: 0, padding: '6px 10px', fontSize: 11 }}
                    onClick={() => deleteResource(r.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Resources;
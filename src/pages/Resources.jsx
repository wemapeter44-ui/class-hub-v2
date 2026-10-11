import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';

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
  const [showForm, setShowForm] = useState(false);

  async function fetchResources() {
    const { data, error } = await supabase
      .from('resources').select('*').order('created_at', { ascending: false });
    if (error) { showToast('Failed to load resources', 'error'); setLoading(false); return; }
    setResources(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchResources(); }, []);

  async function addResource(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const { error } = await supabase.from('resources').insert([{
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      unit: unit.trim(),
    }]);

    if (error) { showToast('Error: ' + error.message, 'error'); return; }

    await createBroadcastNotification({
      title: 'New resource',
      message: `${title.trim()} imeongezwa kwenye resources.`,
    });

    setTitle(''); setDescription(''); setLink(''); setUnit('');
    setShowForm(false);
    showToast('Resource added', 'success');
    fetchResources();
  }

  async function deleteResource(id) {
    const resource = resources.find((r) => r.id === id);
    const ok = await confirm({
      title: 'Delete resource?',
      message: 'This action cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;

    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }

    await createBroadcastNotification({
      title: 'Resource removed',
      message: `${resource?.title || 'A resource'} imeondolewa.`,
    });

    showToast('Resource deleted', 'success');
    fetchResources();
  }

  const inputCls = 'peer w-full px-4 pt-6 pb-2 rounded-xl bg-[#faf9ff] dark:bg-[#1a1430] border border-[#e9e5ff] dark:border-[#2a2148] text-sm text-[#1e1b4b] dark:text-[#f5f3ff] focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-500/20 transition-all';

  const floatLabel = 'absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-600 dark:peer-focus:text-violet-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider peer-[&:not(:placeholder-shown)]:text-violet-600 dark:peer-[&:not(:placeholder-shown)]:text-violet-400';

  return (
    <div className="px-4 pb-6 pt-4 md:px-8 md:pt-6 max-w-3xl mx-auto">

      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-lg font-bold text-[#1e1b4b] dark:text-[#f5f3ff] tracking-tight">Resources</h1>
          <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5 font-medium">
            {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
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
        <form onSubmit={addResource} className="surface p-5 mb-5 space-y-4 animate-fade-up">
          <h2 className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">Add Resource</h2>

          <div className="relative">
            <input id="res-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder=" " className={inputCls} />
            <label htmlFor="res-title" className={floatLabel}>Title</label>
          </div>

          <div className="relative">
            <input id="res-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder=" " className={inputCls} />
            <label htmlFor="res-desc" className={floatLabel}>Description</label>
          </div>

          <div className="relative">
            <input id="res-link" type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder=" " className={inputCls} />
            <label htmlFor="res-link" className={floatLabel}>Link (https://...)</label>
          </div>

          <div className="relative">
            <input id="res-unit" type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder=" " className={inputCls} />
            <label htmlFor="res-unit" className={floatLabel}>Unit</label>
          </div>

          <button type="submit" className="w-full py-3 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md shadow-violet-500/25 active:scale-[0.97] transition">
            Add Resource
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface p-4 space-y-2">
              <div className="h-3.5 bg-violet-100 dark:bg-violet-500/15 rounded animate-pulse w-2/3" />
              <div className="h-2.5 bg-violet-50 dark:bg-violet-500/10 rounded animate-pulse w-full" />
              <div className="h-5 w-20 bg-violet-50 dark:bg-violet-500/10 rounded animate-pulse mt-1" />
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="surface p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/15 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">No resources yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin ? 'Add your first resource to get started.' : 'Resources will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map((r) => (
            <div key={r.id} className="surface p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">{r.title}</p>
                  {r.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{r.description}</p>
                  )}
                  <div className="flex gap-2 mt-2.5 flex-wrap items-center">
                    <span className="text-[10px] text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 rounded-md px-2 py-0.5 uppercase tracking-wide font-semibold">
                      {r.unit || 'General'}
                    </span>
                    {r.link && (
                      <a href={r.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-semibold active:scale-95 transition">
                        Open
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17L17 7M7 7h10v10" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => deleteResource(r.id)} className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-90 transition flex-shrink-0">
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

export default Resources;
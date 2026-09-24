import { useState, useEffect } from 'react';
import { SkeletonList } from '../components/Skeleton';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

function Resources() {
  const { isAdmin, user } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { createNotification } = useNotifications();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [unit, setUnit] = useState('');

  async function fetchResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Failed to load resources', 'error');
      setLoading(false);
      return;
    }

    setResources(data);
    setLoading(false);
  }

  useEffect(() => { fetchResources(); }, []);

  useRealtime('resources', () => fetchResources());

  async function addResource(e) {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a title', 'warning');
      return;
    }

    const { error } = await supabase
      .from('resources')
      .insert([{
        title: title.trim(),
        description: description.trim(),
        link: link.trim(),
        unit: unit.trim(),
      }]);

    if (error) {
      showToast('Failed to add: ' + error.message, 'error');
      return;
    }

    if (user) {
      await createNotification({
        user_id: user.id,
        title: 'Resource Added',
        message: `New resource: "${title.trim()}"`,
      });
    }

    setTitle('');
    setDescription('');
    setLink('');
    setUnit('');
    showToast('Resource added successfully', 'success');
  }

  async function deleteResource(id) {
    const resource = resources.find(r => r.id === id);

    const confirmed = await confirm({
      title: 'Delete Resource',
      message: 'Are you sure you want to delete this resource?',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) return;

    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      showToast('Failed to delete: ' + error.message, 'error');
      return;
    }

    if (user && resource) {
      await createNotification({
        user_id: user.id,
        title: 'Resource Deleted',
        message: `Resource "${resource.title}" has been removed.`,
      });
    }

    showToast('Resource deleted', 'success');
  }

  return (
    <div className="p-6 lg:p-8 animate-fade-up">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Resources</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading...' : `${resources.length} ${resources.length === 1 ? 'resource' : 'resources'}`}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <h2 className="font-semibold text-white text-sm">Add Resource</h2>
          </div>
          <form onSubmit={addResource} className="space-y-3">
            <input
              type="text"
              placeholder="Resource title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
            />
            <input
              type="text"
              placeholder="Short description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="url"
                placeholder="Link (https://...)"
                value={link}
                onChange={e => setLink(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
              <input
                type="text"
                placeholder="Unit (e.g. CEI)"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Resource
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <SkeletonList count={3} />
      ) : resources.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/20">
          <svg className="w-10 h-10 mx-auto mb-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm text-slate-500">No resources yet</p>
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {resources.map(resource => (
            <div
              key={resource.id}
              className="group bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/80 hover:bg-slate-900 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-white text-sm flex-1">{resource.title}</h3>
                {isAdmin && (
                  <button
                    onClick={() => deleteResource(resource.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-red-400 hover:bg-red-500/10 transition flex-shrink-0"
                    aria-label="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                  </button>
                )}
              </div>
              {resource.description && (
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{resource.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2">
                {resource.unit && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded px-2 py-0.5">
                    {resource.unit}
                  </span>
                )}
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    Open
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
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
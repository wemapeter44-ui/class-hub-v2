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
    setResources(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchResources();
  }, []);

  async function addResource(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const { error } = await supabase.from('resources').insert([{
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      unit: unit.trim(),
    }]);

    if (error) {
      showToast('Error: ' + error.message, 'error');
      return;
    }

    await createBroadcastNotification({
      title: 'New resource',
      message: `${title.trim()} imeongezwa kwenye resources.`,
    });

    setTitle('');
    setDescription('');
    setLink('');
    setUnit('');
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
    if (error) {
      showToast('Failed to delete', 'error');
      return;
    }

    await createBroadcastNotification({
      title: 'Resource removed',
      message: `${resource?.title || 'A resource'} imeondolewa.`,
    });

    showToast('Resource deleted', 'success');
    fetchResources();
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Resources
          </h1>
          <p className="text-sm text-green-400 mt-1">
            {resources.length} resource{resources.length !== 1 ? 's' : ''}
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
          onSubmit={addResource}
          className="bg-[#0d1a0d] border border-green-900/30 rounded-xl p-5 mb-6"
        >
          <h2 className="text-sm font-semibold text-white mb-4">Add Resource</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-700"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-700"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="url"
                placeholder="Link (https://...)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-700"
              />
              <input
                type="text"
                placeholder="Unit"
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
            Add Resource
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-green-400 text-sm">Loading...</p>
      ) : resources.length === 0 ? (
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-xl p-10 text-center">
          <p className="text-sm text-green-500/70">No resources yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map((r) => (
            <div
              key={r.id}
              className="bg-[#0d1a0d] border border-green-900/30 rounded-xl p-4 flex justify-between items-start gap-3 hover:border-green-800/60 transition"
            >
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm">{r.title}</p>
                {r.description && (
                  <p className="text-green-300/80 text-xs mt-1 leading-relaxed">
                    {r.description}
                  </p>
                )}
                <div className="flex gap-2 mt-2 flex-wrap items-center">
                  <span className="text-[10px] text-green-400 bg-green-900/40 border border-green-900/50 rounded px-2 py-0.5 uppercase tracking-wide font-semibold">
                    {r.unit || 'General'}
                  </span>
                  {r.link && (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium"
                    >
                      Open →
                    </a>
                  )}
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => deleteResource(r.id)}
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

export default Resources;
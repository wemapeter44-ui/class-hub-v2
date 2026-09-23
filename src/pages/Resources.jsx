import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';

function Resources() {
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
      console.error('Error fetching resources:', error);
      setLoading(false);
      return;
    }

    setResources(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchResources();
  }, []);

  // Realtime updates
  useRealtime('resources', () => {
    fetchResources();
  });

  async function addResource(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const { error } = await supabase
      .from('resources')
      .insert([
        {
          title: title.trim(),
          description: description.trim(),
          link: link.trim(),
          unit: unit.trim(),
        },
      ]);

    if (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource: ' + error.message);
      return;
    }

    setTitle('');
    setDescription('');
    setLink('');
    setUnit('');
  }

  async function deleteResource(id) {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource: ' + error.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
      <p className="text-slate-400 mb-6">
        {loading ? 'Loading...' : `${resources.length} ${resources.length === 1 ? 'resource' : 'resources'}`}
      </p>

      <form onSubmit={addResource} className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <h2 className="font-semibold text-white mb-3">Add Resource</h2>
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
              type="url"
              placeholder="Link (https://...)"
              value={link}
              onChange={e => setLink(e.target.value)}
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
          Add Resource
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
          No resources yet. Add one above.
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map(resource => (
            <div
              key={resource.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{resource.title}</h3>
                  {resource.description && (
                    <p className="text-sm text-slate-400 mt-1">{resource.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3 items-center">
                    {resource.unit && (
                      <span className="text-xs text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded px-2 py-1">
                        {resource.unit}
                      </span>
                    )}
                    {resource.link && (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Open link →
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteResource(resource.id)}
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

export default Resources;
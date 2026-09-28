import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [unit, setUnit] = useState('');

  async function fetchResources() {
    const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
    setResources(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchResources(); }, []);

  async function addResource(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await supabase.from('resources').insert([{
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      unit: unit.trim(),
    }]);
    setTitle(''); setDescription(''); setLink(''); setUnit('');
    fetchResources();
  }

  async function deleteResource(id) {
    if (!confirm('Delete this resource?')) return;
    await supabase.from('resources').delete().eq('id', id);
    fetchResources();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Resources</h1>
        <p className="text-sm text-green-400 mt-1">{resources.length} resources</p>
      </div>

      <form onSubmit={addResource} className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Add Resource</h2>
        <div className="space-y-3">
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
          <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
            className="w-full bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="url" placeholder="Link (https://...)" value={link} onChange={e => setLink(e.target.value)}
              className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
            <input type="text" placeholder="Unit" value={unit} onChange={e => setUnit(e.target.value)}
              className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-green-800 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-md transition">
          Add Resource
        </button>
      </form>

      {loading ? (
        <p className="text-green-400 text-sm">Loading...</p>
      ) : resources.length === 0 ? (
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-8 text-center">
          <p className="text-sm text-green-500/70">No resources yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map(r => (
            <div key={r.id} className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-4 flex justify-between items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-white font-semibold text-sm">{r.title}</p>
                {r.description && <p className="text-green-300/80 text-xs mt-1">{r.description}</p>}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-[10px] text-green-400 bg-green-900/40 border border-green-900/50 rounded px-2 py-0.5 uppercase tracking-wide">{r.unit || 'General'}</span>
                  {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:text-blue-300 underline">Open →</a>}
                </div>
              </div>
              <button onClick={() => deleteResource(r.id)} className="text-red-400 hover:text-red-300 text-xs flex-shrink-0">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resources;
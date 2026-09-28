import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [phone, setPhone] = useState('');

  async function fetchStudents() {
    const { data, error } = await supabase
      .from('students').select('*').order('created_at', { ascending: false });
    if (error) { setLoading(false); return; }
    setStudents(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchStudents(); }, []);

  async function addStudent(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const { error } = await supabase.from('students').insert([{
      name: name.trim(),
      registration: registration.trim(),
      phone: phone.trim(),
    }]);
    if (error) { alert('Error: ' + error.message); return; }
    setName(''); setRegistration(''); setPhone('');
    fetchStudents();
  }

  async function deleteStudent(id) {
    if (!confirm('Delete this student?')) return;
    await supabase.from('students').delete().eq('id', id);
    fetchStudents();
  }

  function initials(n) {
    return String(n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Class Members</h1>
        <p className="text-sm text-green-400 mt-1">{students.length} students</p>
      </div>

      <form onSubmit={addStudent} className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Add Student</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required
            className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
          <input type="text" placeholder="Registration" value={registration} onChange={e => setRegistration(e.target.value)}
            className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
          <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)}
            className="bg-[#0a120a] border border-green-900/40 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-green-700" />
        </div>
        <button type="submit" className="mt-4 bg-green-800 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2 rounded-md transition">
          Add Student
        </button>
      </form>

      {loading ? (
        <p className="text-green-400 text-sm">Loading...</p>
      ) : students.length === 0 ? (
        <div className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-8 text-center">
          <p className="text-sm text-green-500/70">No students yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map(s => (
            <div key={s.id} className="bg-[#0d1a0d] border border-green-900/30 rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-900/40 border border-green-900/50 flex items-center justify-center text-green-400 text-xs font-bold flex-shrink-0">
                {initials(s.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{s.name}</p>
                <p className="text-green-500/80 text-xs mt-0.5 truncate">{s.registration || 'No registration'}</p>
              </div>
              <button onClick={() => deleteStudent(s.id)} className="text-red-400 hover:text-red-300 text-xs flex-shrink-0">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;
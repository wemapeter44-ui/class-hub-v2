import { useState, useEffect } from 'react';
import StudentCard from '../components/StudentCard';
import { supabase } from '../lib/supabase';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [phone, setPhone] = useState('');

  async function fetchStudents() {
    setLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
      return;
    }

    setStudents(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function addStudent(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          name: name.trim(),
          registration: registration.trim(),
          phone: phone.trim(),
        },
      ])
      .select();

    if (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student: ' + error.message);
      return;
    }

    setStudents([data[0], ...students]);
    setName('');
    setRegistration('');
    setPhone('');
  }

  async function deleteStudent(id) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student: ' + error.message);
      return;
    }

    setStudents(students.filter(s => s.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
      <p className="text-slate-400 mb-6">
        {loading ? 'Loading...' : `${students.length} ${students.length === 1 ? 'student' : 'students'}`}
      </p>

      <form onSubmit={addStudent} className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <h2 className="font-semibold text-white mb-3">Add Student</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Registration"
            value={registration}
            onChange={e => setRegistration(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          type="submit"
          className="mt-3 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          Add Student
        </button>
      </form>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
          No students yet. Add one above.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {students.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={deleteStudent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;
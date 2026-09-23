import { useState, useEffect } from 'react';
import StudentCard from '../components/StudentCard';
import { SkeletonGrid } from '../components/Skeleton';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

function Students() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { createNotification } = useNotifications();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [phone, setPhone] = useState('');

  async function fetchStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching students:', error);
      showToast('Failed to load students', 'error');
      setLoading(false);
      return;
    }

    setStudents(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  useRealtime('students', () => {
    fetchStudents();
  });

  async function addStudent(e) {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a name', 'warning');
      return;
    }

    const { error } = await supabase
      .from('students')
      .insert([
        {
          name: name.trim(),
          registration: registration.trim(),
          phone: phone.trim(),
        },
      ]);

    if (error) {
      console.error('Error adding student:', error);
      showToast('Failed to add: ' + error.message, 'error');
      return;
    }

    // Create notification kwa user mwenyewe
    if (user) {
      await createNotification({
        user_id: user.id,
        title: 'Student Added',
        message: `${name.trim()} has been added to the class.`,
      });
    }

    setName('');
    setRegistration('');
    setPhone('');
    showToast('Student added successfully', 'success');
  }

  async function deleteStudent(id) {
    const student = students.find(s => s.id === id);

    const confirmed = await confirm({
      title: 'Delete Student',
      message: 'Are you sure you want to delete this student? This action cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });

    if (!confirmed) return;

    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting student:', error);
      showToast('Failed to delete: ' + error.message, 'error');
      return;
    }

    if (user && student) {
      await createNotification({
        user_id: user.id,
        title: 'Student Deleted',
        message: `${student.name} has been removed from the class.`,
      });
    }

    showToast('Student deleted', 'success');
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
        <SkeletonGrid count={4} />
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
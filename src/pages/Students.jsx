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
  const { isAdmin, user } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { createNotification } = useNotifications();
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
    <div className="p-6 lg:p-8 animate-fade-up">
      {/* Page header */}
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Students</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading...' : `${students.length} ${students.length === 1 ? 'student' : 'students'} enrolled`}
          </p>
        </div>
      </div>

      {/* Add form — admin only */}
      {isAdmin && (
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <h2 className="font-semibold text-white text-sm">Add Student</h2>
          </div>
          <form onSubmit={addStudent}>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
              <input
                type="text"
                placeholder="Registration number"
                value={registration}
                onChange={e => setRegistration(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/10 transition"
              />
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-lg hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : students.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/20">
          <svg className="w-10 h-10 mx-auto mb-3 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-slate-500">No students enrolled yet</p>
          {isAdmin && <p className="text-xs text-slate-600 mt-1">Add one above to get started</p>}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {students.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={deleteStudent}
              canDelete={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;
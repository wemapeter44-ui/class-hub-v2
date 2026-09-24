import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRealtime } from '../hooks/useRealtime';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';

function initials(name) {
  return String(name || '?').trim().split(/\s+/).slice(0, 2)
    .map(w => w[0] || '').join('').toUpperCase() || '?';
}

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
      showToast('Failed to load students', 'error');
      setLoading(false);
      return;
    }
    setStudents(data);
    setLoading(false);
  }

  useEffect(() => { fetchStudents(); }, []);
  useRealtime('students', () => fetchStudents());

  async function addStudent(e) {
    e.preventDefault();
    if (!name.trim()) return showToast('Enter student name', 'warning');

    const { error } = await supabase.from('students').insert([{
      name: name.trim(),
      registration: registration.trim(),
      phone: phone.trim(),
    }]);

    if (error) return showToast('Failed: ' + error.message, 'error');

    // Create notification
    if (user) {
      console.log('Attempting to create notification...');
      await createNotification({
        user_id: user.id,
        title: 'Student Added',
        message: `${name.trim()} has been added to the class.`,
      });
    }

    setName(''); setRegistration(''); setPhone('');
    showToast('Student added', 'success');
  }

  async function deleteStudent(id) {
    const student = students.find(s => s.id === id);
    const ok = await confirm({
      title: 'Delete Student',
      message: 'Are you sure? This cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;

    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) return showToast('Failed: ' + error.message, 'error');

    // Create notification
    if (user && student) {
      await createNotification({
        user_id: user.id,
        title: 'Student Deleted',
        message: `${student.name} has been removed.`,
      });
    }

    showToast('Student deleted', 'success');
  }

  return (
    <>
      <div className="section-head">
        <h2>Class Members</h2>
        <span className="meta">{students.length} {students.length === 1 ? 'student' : 'students'}</span>
      </div>

      {isAdmin && (
        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div className="section-head" style={{ marginBottom: 16 }}>
            <h2>Add Student</h2>
          </div>
          <form onSubmit={addStudent}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Student full name"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 11,
                    background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)',
                    color: 'var(--text)', outline: 'none', fontSize: 13.5
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Registration</label>
                <input
                  value={registration}
                  onChange={e => setRegistration(e.target.value)}
                  placeholder="Registration number"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 11,
                    background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)',
                    color: 'var(--text)', outline: 'none', fontSize: 13.5
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--text-2)', fontSize: 11.5, fontWeight: 600, marginBottom: 7 }}>Phone</label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 11,
                    background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)',
                    color: 'var(--text)', outline: 'none', fontSize: 13.5
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              style={{
                marginTop: 16, padding: '12px 18px', borderRadius: 11,
                background: 'var(--gradient)', color: '#04121a',
                fontWeight: 700, fontSize: 13, border: 0, cursor: 'pointer',
                boxShadow: '0 8px 22px -10px rgba(34,211,238,.55)'
              }}
            >
              Add Student
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="sk-row"><div className="sk sk-line"></div><div className="sk sk-line short"></div></div>
      ) : students.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' }} />
          <h4>No members yet</h4>
          <p>Class members will appear here once added.</p>
        </div>
      ) : (
        <div className="members">
          {students.map(s => (
            <div key={s.id} className="member">
              <div className="avatar">{initials(s.name)}</div>
              <div className="member-info">
                <strong>{s.name}</strong>
                <p>{s.registration || 'No registration'}</p>
              </div>
              {isAdmin && (
                <button
                  className="link-btn"
                  style={{ background: 'rgba(248,113,113,.10)', borderColor: 'rgba(248,113,113,.22)', color: 'var(--danger)', marginTop: 0, marginLeft: 0, padding: '6px 10px', fontSize: 11 }}
                  onClick={() => deleteStudent(s.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Students;
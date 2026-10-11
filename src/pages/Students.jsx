import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../contexts/ConfirmContext';
import { useNotifications } from '../contexts/NotificationContext';

function Students() {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { createBroadcastNotification } = useNotifications();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [phone, setPhone] = useState('');
  const [linkEmail, setLinkEmail] = useState('');
  const [showForm, setShowForm] = useState(false);

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

    const withAvatars = await Promise.all(
      (data || []).map(async (s) => {
        if (!s.user_id) return { ...s, avatarUrl: null };
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${s.user_id}/avatar.jpg`);
        const url = urlData?.publicUrl;
        if (!url) return { ...s, avatarUrl: null };
        try {
          const res = await fetch(url, { method: 'HEAD' });
          return { ...s, avatarUrl: res.ok ? url + '?t=' + Date.now() : null };
        } catch {
          return { ...s, avatarUrl: null };
        }
      })
    );

    setStudents(withAvatars);
    setLoading(false);
  }

  useEffect(() => { fetchStudents(); }, []);

  async function addStudent(e) {
    e.preventDefault();
    if (!name.trim()) return;

    let userId = null;
    if (linkEmail.trim()) {
      const { data: usersData, error: userErr } = await supabase
        .rpc('get_user_id_by_email', { email_input: linkEmail.trim() });
      if (userErr) {
        showToast('Could not find user with that email', 'error');
        return;
      }
      userId = usersData;
    }

    const { error } = await supabase.from('students').insert([{
      name: name.trim(),
      registration: registration.trim(),
      phone: phone.trim(),
      user_id: userId,
    }]);

    if (error) {
      showToast('Error: ' + error.message, 'error');
      return;
    }

    await createBroadcastNotification({
      title: 'New member added',
      message: `${name.trim()} ameongezwa kwenye class members.`,
    });

    setName(''); setRegistration(''); setPhone(''); setLinkEmail('');
    setShowForm(false);
    showToast('Student added', 'success');
    fetchStudents();
  }

  async function deleteStudent(id) {
    const student = students.find((s) => s.id === id);
    const ok = await confirm({
      title: 'Delete student?',
      message: 'This action cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!ok) return;

    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) { showToast('Failed to delete', 'error'); return; }

    await createBroadcastNotification({
      title: 'Member removed',
      message: `${student?.name || 'A member'} ameondolewa kwenye class.`,
    });

    showToast('Student deleted', 'success');
    fetchStudents();
  }

  function initials(n) {
    return String(n || '?').trim().split(/\s+/).slice(0, 2)
      .map((w) => w[0] || '').join('').toUpperCase() || '?';
  }

  const inputCls = 'peer w-full px-4 pt-6 pb-2 rounded-xl bg-[#faf9ff] dark:bg-[#1a1430] border border-[#e9e5ff] dark:border-[#2a2148] text-sm text-[#1e1b4b] dark:text-[#f5f3ff] focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-500/20 transition-all';

  const floatLabel = 'absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-violet-600 dark:peer-focus:text-violet-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider peer-[&:not(:placeholder-shown)]:text-violet-600 dark:peer-[&:not(:placeholder-shown)]:text-violet-400';

  return (
    <div className="px-4 pb-6 pt-4 md:px-8 md:pt-6 max-w-3xl mx-auto">

      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h1 className="text-lg font-bold text-[#1e1b4b] dark:text-[#f5f3ff] tracking-tight">Class Members</h1>
          <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5 font-medium">
            {students.length} {students.length === 1 ? 'student' : 'students'}
          </p>
        </div>
        {isAdmin ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl brand-gradient text-white text-xs font-semibold shadow-md shadow-violet-500/25 active:scale-95 transition"
          >
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
        <form onSubmit={addStudent} className="surface p-5 mb-5 space-y-4 animate-fade-up">
          <h2 className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">Add Student</h2>

          <div className="relative">
            <input id="student-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder=" " className={inputCls} />
            <label htmlFor="student-name" className={floatLabel}>Full name</label>
          </div>

          <div className="relative">
            <input id="student-reg" type="text" value={registration} onChange={(e) => setRegistration(e.target.value)} placeholder=" " className={inputCls} />
            <label htmlFor="student-reg" className={floatLabel}>Registration</label>
          </div>

          <div className="relative">
            <input id="student-phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder=" " className={inputCls} />
            <label htmlFor="student-phone" className={floatLabel}>Phone</label>
          </div>

          <div className="relative">
            <input id="student-email" type="email" value={linkEmail} onChange={(e) => setLinkEmail(e.target.value)} placeholder=" " className={inputCls} />
            <label htmlFor="student-email" className={floatLabel}>Account email (optional)</label>
          </div>

          <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
            Kama student ana account, weka email yake kuonyesha avatar yake.
          </p>

          <button type="submit" className="w-full py-3 rounded-xl brand-gradient text-white font-semibold text-sm shadow-md shadow-violet-500/25 active:scale-[0.97] transition">
            Add Student
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="surface p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-500/15 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-violet-100 dark:bg-violet-500/15 rounded animate-pulse w-1/2" />
                <div className="h-2.5 bg-violet-50 dark:bg-violet-500/10 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="surface p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/15 border border-violet-100 dark:border-violet-500/20 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 1 8 0M20 8v6M23 11h-6" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff]">No students yet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isAdmin ? 'Add your first student to get started.' : 'Students will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((s) => (
            <div key={s.id} className="surface p-4 flex items-center gap-3">
              {s.avatarUrl ? (
                <img src={s.avatarUrl} alt={s.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 shadow-sm" />
              ) : (
                <div className="w-11 h-11 rounded-xl brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  {initials(s.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1e1b4b] dark:text-[#f5f3ff] truncate">{s.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{s.registration || 'No registration'}</p>
              </div>
              {isAdmin && (
                <button onClick={() => deleteStudent(s.id)} className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-90 transition flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Students;
import { useState } from 'react';
import StudentCard from '../components/StudentCard';

function Students({ students, setStudents }) {
  const [name, setName] = useState('');
  const [registration, setRegistration] = useState('');
  const [phone, setPhone] = useState('');

  function addStudent(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const newStudent = {
      id: Date.now(),
      name: name.trim(),
      registration: registration.trim(),
      phone: phone.trim(),
    };

    setStudents([...students, newStudent]);
    setName('');
    setRegistration('');
    setPhone('');
  }

  function deleteStudent(id) {
    setStudents(students.filter(s => s.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
      <p className="text-slate-400 mb-6">
        {students.length} {students.length === 1 ? 'student' : 'students'}
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

      <div className="grid gap-3 sm:grid-cols-2">
        {students.map(student => (
          <StudentCard
            key={student.id}
            student={student}
            onDelete={deleteStudent}
          />
        ))}
      </div>
    </div>
  );
}

export default Students;
function StudentCard({ student, onDelete }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-white">{student.name}</h3>
          <p className="text-slate-400 text-sm mt-1">
            {student.registration}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            {student.phone}
          </p>
        </div>
        <button
          onClick={() => onDelete(student.id)}
          className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-500/10 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
function StudentCard({ student, onDelete, canDelete }) {
  const initials = student.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="group bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/80 hover:bg-slate-900 transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 border border-cyan-400/20 flex items-center justify-center text-cyan-400 text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{student.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {student.registration || 'No registration'}
          </p>
          {student.phone && (
            <p className="text-xs text-slate-600 mt-0.5 truncate">{student.phone}</p>
          )}
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(student.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-red-400 hover:bg-red-500/10 transition"
            aria-label="Delete"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default StudentCard;
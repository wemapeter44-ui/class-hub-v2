function Toast({ message, type, onClose }) {
  const styles = {
    success: {
      accent: 'bg-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      title: 'Success',
    },
    error: {
      accent: 'bg-red-500',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      title: 'Error',
    },
    info: {
      accent: 'bg-violet-500',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      title: 'Info',
    },
    warning: {
      accent: 'bg-amber-500',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      title: 'Warning',
    },
  };

  const icons = {
    success: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    warning: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const s = styles[type] || styles.info;

  return (
    <div
      className="relative flex items-start gap-3 pl-4 pr-3 py-3.5 rounded-2xl bg-white border border-[#e9e5ff] shadow-lg shadow-violet-500/10 animate-slide-in overflow-hidden"
      role="alert"
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.accent}`} />

      {/* Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${s.iconBg} ${s.iconColor}`}>
        {icons[type] || icons.info}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 leading-none mb-1">
          {s.title}
        </p>
        <p className="text-sm font-medium text-[#1e1b4b] leading-snug break-words">
          {message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1e1b4b] hover:bg-violet-50 active:scale-90 transition"
        aria-label="Close"
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default Toast;
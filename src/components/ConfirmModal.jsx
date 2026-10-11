function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-[#1e1b4b]/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white border border-[#e9e5ff] rounded-3xl p-6 max-w-sm w-full shadow-2xl shadow-violet-500/20 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
            danger ? 'bg-red-50 text-red-500' : 'bg-violet-50 text-violet-600'
          }`}
        >
          {danger ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM12 16v-4M12 8h.01" />
            </svg>
          )}
        </div>

        {/* Title + message */}
        <h3 className="text-base font-bold text-[#1e1b4b] mb-1.5 leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#1e1b4b] bg-[#faf9ff] border border-[#e9e5ff] hover:bg-violet-50 active:scale-[0.97] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold text-white active:scale-[0.97] transition shadow-md ${
              danger
                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25'
                : 'brand-gradient shadow-violet-500/25'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
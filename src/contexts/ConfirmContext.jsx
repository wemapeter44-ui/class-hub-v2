import { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    danger: false,
    resolve: null,
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title || 'Are you sure?',
        message: options.message || 'This action cannot be undone.',
        confirmText: options.confirmText || 'Confirm',
        danger: options.danger || false,
        resolve,
      });
    });
  }, []);

  function handleConfirm() {
    state.resolve(true);
    setState(prev => ({ ...prev, isOpen: false, resolve: null }));
  }

  function handleCancel() {
    state.resolve(false);
    setState(prev => ({ ...prev, isOpen: false, resolve: null }));
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <ConfirmModal
        isOpen={state.isOpen}
        title={state.title}
        message={state.message}
        confirmText={state.confirmText}
        danger={state.danger}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
}
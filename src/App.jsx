import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';
import Login from './pages/Login';

function App() {
  const { user, loading, signOut } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  function renderPage() {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <Students />;
      case 'timetable':
        return <Timetable />;
      case 'tasks':
        return <Tasks />;
      case 'resources':
        return <Resources />;
      default:
        return (
          <div className="p-6 text-slate-400">
            This page is coming soon...
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 pt-16 lg:pt-0">
          {renderPage()}
        </div>
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 mb-2 truncate">
            {user.email}
          </div>
          <button
            onClick={signOut}
            className="text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
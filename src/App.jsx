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

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  // Not logged in → show Login page
  if (!user) {
    return <Login />;
  }

  // Logged in → show app
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
      <div className="flex flex-col">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <div className="p-4 border-t border-slate-800 mt-auto">
          <div className="text-xs text-slate-500 mb-2 truncate">
            {user.email}
          </div>
          <button
            onClick={signOut}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            Sign out
          </button>
        </div>
      </div>
      <main className="flex-1">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
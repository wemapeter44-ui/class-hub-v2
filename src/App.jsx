import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse">
            <svg className="w-5 h-5 text-slate-950" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-slate-600 text-xs font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showSignUp) {
      return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />;
    }
    return <Login onSwitchToSignUp={() => setShowSignUp(true)} />;
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
          <div className="p-6 text-slate-400">This page is coming soon...</div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar activePage={activePage} onNavigate={setActivePage} />
        <main className="flex-1 pt-16 lg:pt-0">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
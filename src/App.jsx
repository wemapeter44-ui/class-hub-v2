import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';

function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a120a] flex items-center justify-center">
        <p className="text-green-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  function renderPage() {
    switch (activePage) {
      case 'home': return <Dashboard />;
      case 'timetable': return <Dashboard />;
      case 'members': return <Students />;
      case 'announcements': return <Dashboard />;
      case 'tasks': return <Dashboard />;
      case 'resources': return <Dashboard />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-[#0a120a] flex">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-x-hidden relative">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/kcnp-campus.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginLeft: '16rem',
            opacity: 0.08,
          }}
        ></div>
        <div className="relative z-10">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
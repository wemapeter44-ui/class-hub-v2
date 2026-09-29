import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';

function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [authPage, setAuthPage] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a120a] flex items-center justify-center">
        <p className="text-green-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    if (authPage === 'signup') return <SignUp onNavigate={setAuthPage} />;
    return <Login onNavigate={setAuthPage} />;
  }

  function renderPage() {
    switch (activePage) {
      case 'home': return <Dashboard />;
      case 'timetable': return <Timetable />;
      case 'members': return <Students />;
      case 'tasks': return <Tasks />;
      case 'resources': return <Resources />;
      default: return <Dashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-[#0a120a] flex">
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setMobileMenuOpen(false);
        }}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 min-w-0 relative">
        <div
          className="fixed inset-0 pointer-events-none hidden md:block"
          style={{
            backgroundImage: 'url(/kcnp-campus.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginLeft: '16rem',
            opacity: 0.08,
          }}
        ></div>

        <div className="relative z-10">
          <TopBar
            activePage={activePage}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
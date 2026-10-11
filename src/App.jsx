import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import AppHeader from './components/AppHeader';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import About from './pages/About';
import Privacy from './pages/Privacy';

function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [authPage, setAuthPage] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] dark:bg-[#0b0918] flex items-center justify-center transition-colors">
        <div className="w-8 h-8 rounded-full border-2 border-violet-200 dark:border-[#2a2148] border-t-violet-500 animate-spin" />
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
      case 'profile': return <Profile onBack={() => setActivePage('home')} onNavigate={setActivePage} />;
      case 'about': return <About onBack={() => setActivePage('profile')} />;
      case 'privacy': return <Privacy onBack={() => setActivePage('profile')} />;
      default: return <Dashboard />;
    }
  }

  const showChrome = activePage !== 'profile' && activePage !== 'about' && activePage !== 'privacy';

  return (
    <div className="min-h-screen bg-[#f5f3ff] dark:bg-[#0b0918] flex relative transition-colors">
      {showChrome && (
        <div className="hidden md:block">
          <Sidebar
            activePage={activePage}
            onNavigate={setActivePage}
            mobileOpen={false}
            onClose={() => {}}
          />
        </div>
      )}

      <main className="flex-1 min-w-0 relative z-10">
        {showChrome && <AppHeader user={user} onAvatarClick={() => setActivePage('profile')} />}

        {showChrome && (
          <div className="hidden md:block">
            <TopBar activePage={activePage} onMenuClick={() => {}} />
          </div>
        )}

        <div className={`animate-fade-up ${showChrome ? 'pb-20 md:pb-0' : ''}`}>
          {renderPage()}
        </div>
      </main>

      {showChrome && (
        <BottomNav activePage={activePage} onNavigate={setActivePage} />
      )}
    </div>
  );
}

export default App;
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
  const [activePage, setActivePage] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div id="loadingOverlay">
        <div className="loading-box">
          <div className="loading-logo">PD</div>
          <h2>Loading Class Hub</h2>
          <p>Connecting to portal...</p>
          <div className="loading-bar"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showSignUp) return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />;
    return <Login onSwitchToSignUp={() => setShowSignUp(true)} />;
  }

  function renderPage() {
    switch (activePage) {
      case 'home': return <Dashboard />;
      case 'timetable': return <Timetable />;
      case 'members': return <Students />;
      case 'tasks': return <Tasks />;
      case 'resources': return <Resources />;
      default: return null;
    }
  }

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main ready">
        <TopBar
          activePage={activePage}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
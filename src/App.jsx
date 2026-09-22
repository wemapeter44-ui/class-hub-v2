import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

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
      <main className="flex-1">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Timetable from './pages/Timetable';
import Tasks from './pages/Tasks';
import Resources from './pages/Resources';
import { initialStudents } from './data/students';
import { initialTasks } from './data/tasks';
import { initialResources } from './data/resources';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [students, setStudents] = useState(initialStudents);
  const [tasks, setTasks] = useState(initialTasks);
  const [resources, setResources] = useState(initialResources);

  function renderPage() {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard students={students} />;
      case 'students':
        return <Students students={students} setStudents={setStudents} />;
      case 'timetable':
        return <Timetable />;
      case 'tasks':
        return <Tasks tasks={tasks} setTasks={setTasks} />;
      case 'resources':
        return <Resources resources={resources} setResources={setResources} />;
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
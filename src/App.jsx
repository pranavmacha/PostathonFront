import React, { useState } from 'react';
import UserComplaintForm from './components/user/UserComplaintForm';
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './components/admin/Login';
import DepartmentSelect from './components/admin/DepartmentSelect';
import { Layout } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing'); // 'landing', 'user', 'admin-login', 'admin-dept', 'admin-dashboard'
  const [selectedDept, setSelectedDept] = useState(null);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return (
          <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', gap: '2rem' }}>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              PostHub Connect
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', textAlign: 'center' }}>
              Solving your postal, finance, and technical issues with transparency and speed.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
              <button onClick={() => setView('user')} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                User Portal
              </button>
              <button onClick={() => setView('admin-login')} className="btn" style={{ padding: '1rem 2rem', background: 'white', color: 'var(--bg-dark)' }}>
                Admin Portal
              </button>
            </div>
          </div>
        );
      case 'user':
        return <UserComplaintForm onBack={() => setView('landing')} />;
      case 'admin-login':
        return <Login onLogin={() => setView('admin-dept')} onBack={() => setView('landing')} />;
      case 'admin-dept':
        return (
          <DepartmentSelect
            onSelect={(dept) => {
              setSelectedDept(dept);
              setView('admin-dashboard');
            }}
            onBack={() => setView('landing')}
          />
        );
      case 'admin-dashboard':
        return <AdminDashboard department={selectedDept} onLogout={() => { setView('landing'); setSelectedDept(null); }} />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="App">
      <nav className="glass-morphism" style={{ padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: '700', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setView('landing')}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px' }}></div>
          PostHub
        </div>
        <div>
          {view !== 'landing' && (
            <button onClick={() => setView('landing')} className="btn" style={{ fontSize: '0.875rem', opacity: 0.8 }}>Home</button>
          )}
        </div>
      </nav>
      {renderView()}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import VerificationForm from './components/VerificationForm';
import ApplicationsList from './components/ApplicationsList';
import PetsList from './components/PetsList';
import AdminPanel from './components/AdminPanel';
import Navigation from './components/Navigation';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('login');
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Cargando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        {currentView === 'login' && (
          <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
        )}
        {currentView === 'register' && (
          <RegisterForm 
            onSwitchToLogin={() => setCurrentView('login')}
            onRegistrationSuccess={(email) => {
              setPendingVerificationEmail(email);
              setCurrentView('verification');
            }}
          />
        )}
        {currentView === 'verification' && (
          <VerificationForm 
            email={pendingVerificationEmail}
            onBackToRegister={() => setCurrentView('register')}
          />
        )}
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'pets':
        return <PetsList />;
      case 'myApplications':
        return <ApplicationsList />;
      case 'admin':
        return <AdminPanel />;
      default:
        setCurrentView('pets');
        return <PetsList />;
    }
  };

  return (
    <div className="App">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

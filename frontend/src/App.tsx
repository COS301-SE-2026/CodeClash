import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MathFieldTest from './pages/MathFieldTest';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
  //const [page, setPage] = useState<Page>('mathfieldtest');

type Page = 'welcome' | 'signin' | 'signup' | 'dashboard' | 'mathfieldtest';
const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState<Page>('welcome');

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      {page === 'mathfieldtest' && <MathFieldTest />}
      {page === 'welcome' && (
        <Welcome
          onSignIn={() => setPage('signin')}
          onSignUp={() => setPage('signup')}
        />
      )}
      {page === 'signin' && (
        <SignIn
          onBack={() => setPage('welcome')}
          onSignUp={() => setPage('signup')}
        />
      )}
      {page === 'signup' && (
        <SignUp
          onBack={() => setPage('welcome')}
          onSignIn={() => setPage('signin')}
        />
      )}
    </>
  );
};

export default App;
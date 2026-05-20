import React, { useState } from 'react';
//import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';

type Page = 'welcome' | 'signin' | 'signup' | 'dashboard';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState<Page>('welcome');

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
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
import React, { useState } from 'react';
//import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Searching from './pages/queuePages/searching';
import Found from './pages/queuePages/found';
import { useAuth } from './context/AuthContext';

type Page = 'welcome' | 'signin' | 'signup' | 'dashboard' | 'profile' | 'searching' | 'found';

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
          onSignIn={(data) => { console.log(data); setPage('dashboard'); }}
        />
      )}
      {page === 'signup' && (
        <SignUp
          onBack={() => setPage('welcome')}
          onSignUp={() => setPage('signin')}
        />
      )}
      {page === 'dashboard' && (
        <Dashboard
          onProfileClick={() => setPage('profile')}
          onRankedPlay={(topic) => {
            console.log('Topic selected:', topic);
            setPage('searching');
          }}
          onCasualPlay={() => setPage('searching')}
        />
      )}
      {page === 'profile' && (
        <Profile
          onBack={() => setPage('dashboard')}
          onLogout={() => setPage('welcome')}
        />
      )}
      {page === 'searching' && (
        <Searching
          onCancel={() => setPage('dashboard')}
          onFound={() => setPage('found')}
        />
      )}
      {page === 'found' && (
        <Found
          onDecline={() => setPage('dashboard')}
          onAccept={() => console.log('match accepted — wire to match page when ready')}
          onSignIn={() => setPage('signin')}
        />
      )}
    </>
  );
};

export default App;
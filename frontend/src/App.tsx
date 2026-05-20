import React, { useState } from 'react';
//import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MathFieldTest from './pages/MathFieldTest';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Searching from './pages/queuePages/searching';
import Found from './pages/queuePages/found';
import ProgMatch from './pages/ProgMatch';
import { useAuth } from './context/AuthContext';
import { mock_match } from './mocks/prog-match.mock';
  //const [page, setPage] = useState<Page>('mathfieldtest');

type Page = 'welcome' | 'signin' | 'signup' | 'dashboard' | 'profile' | 'searching' | 'found' | 'mathfieldtest' | 'prog-match';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [page, setPage] = useState<Page>('prog-match');

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      {page === 'prog-match' && <ProgMatch language="java" match={mock_match}></ProgMatch>}
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
          onSignIn={() => { setPage('dashboard'); }}
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
          // onSignIn={() => setPage('signin')}
        />
      )}
    </>
  );
};

export default App;
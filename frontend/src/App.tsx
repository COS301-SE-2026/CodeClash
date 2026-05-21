import React, { useState } from 'react';
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

type QueueType = 'math' | 'programming' | null;

type Page =
  | 'welcome'
  | 'signin'
  | 'signup'
  | 'dashboard'
  | 'profile'
  | 'searching'
  | 'found'
  | 'mathfieldtest'
  | 'prog-match';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const [page, setPage] = useState<Page>('dashboard');
  const [queueType, setQueueType] = useState<QueueType>(null);

  if (isLoading) return null;

  if (isAuthenticated && page === 'welcome') {
    return (
      <Dashboard
        onProfileClick={() => setPage('profile')}
        onRankedPlay={(topic) => {
          console.log('Topic selected:', topic);

          if (topic.toLowerCase().includes('math')) {
            setQueueType('math');
          } else {
            setQueueType('programming');
          }

          setPage('searching');
        }}
        onCasualPlay={() => {
          setQueueType('programming');
          setPage('searching');
        }}
      />
    );
  }

  return (
    <>
      {page === 'prog-match' && (
        <ProgMatch language="java" match={mock_match} back={() => setPage('dashboard')} />
      )}

      {page === 'mathfieldtest' && <MathFieldTest back={() => setPage('dashboard')} />}

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
          onSignIn={() => {
            setPage('dashboard');
          }}
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

            if (topic.toLowerCase().includes('math')) {
              setQueueType('math');
            } else {
              setQueueType('programming');
            }

            setPage('searching');
          }}
          onCasualPlay={() => {
            setQueueType('programming');
            setPage('searching');
          }}
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
          onAccept={() => {
            if (queueType === 'math') {
              setPage('mathfieldtest');
            } else {
              setPage('prog-match');
            }
          }}
        />
      )}
    </>
  );
};

export default App;
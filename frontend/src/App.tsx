import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

type Page = 'welcome' | 'signin' | 'signup' | 'dashboard' | 'profile';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('welcome');
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
          onSignIn={(data) => {console.log(data); setPage('dashboard');}}
        />
      )}
      {page === 'signup' && (
        <SignUp
          onBack={() => setPage('welcome')}
          onSignUp={(data) => console.log('Sign up:', data)}
        />
      )}
      {page === 'dashboard' && (
        <Dashboard 
          onNavChange={(p) => console.log(p)}
          onProfileClick={() => setPage('profile')}
        />
      )}
      {page === 'profile' && (
        <Profile
        onBack={() => setPage('dashboard')}
        onLogout={() => setPage('welcome')}
        />
      )}
    </>
  );
};

export default App;
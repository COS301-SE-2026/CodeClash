import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MathFieldTest from './pages/MathFieldTest';

type Page = 'welcome' | 'signin' | 'signup' | 'mathfieldtest';

const App: React.FC = () => {
  //const [page, setPage] = useState<Page>('mathfieldtest');
  const [page, setPage] = useState<Page>('welcome');
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
          onSignIn={(data) => console.log('Sign in:', data)}
        />
      )}
      {page === 'signup' && (
        <SignUp
          onBack={() => setPage('welcome')}
          onSignUp={(data) => console.log('Sign up:', data)}
        />
      )}
    </>
  );
};

export default App;
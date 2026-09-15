import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const amplify = vi.hoisted(() => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
  confirmSignUp: vi.fn(),
  resendSignUpCode: vi.fn(),
  resetPassword: vi.fn(),
  confirmResetPassword: vi.fn(),
  fetchAuthSession: vi.fn(),  
}));

vi.mock('aws-amplify/auth', () => amplify);

import { AuthProvider } from 'src/context/AuthContext';
import { useAuth } from 'src/context/AuthContext';

const SIGN_UP_DATA = {
  username: 'ntu',
  firstName: 'Ntu',
  lastName: 'Mbatha',
  email: 'ntu@codeclash.dev',
  phoneNumber: '+27123456789',
  password: 'Sup3rSecret!',
};

const AuthConsumer = () => {
  const auth = useAuth();

  return (
    <div>
         <span data-testid="loading">{String(auth.isLoading)}</span>
         <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
         <span data-testid="username">{auth.user?.username ?? 'none'}</span>
         <span data-testid="userId">{auth.user?.userId ?? 'none'}</span>
         <span data-testid="token">{auth.token ?? 'none'}</span>
         <span data-testid="error">{auth.error ?? 'none'}</span>
         <button onClick={() => void auth.signIn('ntu@codeclash.dev', 'pw').catch(() => {})}>sign-in</button>
         <button onClick={() => void auth.signUp(SIGN_UP_DATA).catch(() => {})}>sign-up</button>
         <button onClick={() => void auth.signOut().catch(() => {})}>sign-out</button>
         <button onClick={() => void auth.confirmSignUp('ntu', '123456').catch(() => {})}>confirm</button>
         <button onClick={() => void auth.resendSignUpCode('ntu').catch(() => {})}>resend</button>
         <button onClick={() => void auth.forgotPassword('ntu@codeclash.dev').catch(() => {})}>forgot</button>
         <button onClick={() => void auth.confirmForgotPassword('ntu@codeclash.dev', '123456', 'New!').catch(() => {})}>
           confirm-forgot
         </button>
         <button onClick={auth.clearError}>clear-error</button>
       </div>  
  );
};

const renderAuth = () => render(
  <AuthProvider>
    <AuthConsumer />
  </AuthProvider>
);

const session = (idToken?: string) => ({
  tokens: idToken ? { idToken: { toString: () => idToken } } : undefined,
});


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

import { AuthProvider } from 'src/context/Auth/AuthContext';
import { useAuth } from 'src/context/Auth/hooks/useAuth';

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

describe('AuthProvider integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    amplify.getCurrentUser.mockResolvedValue({ username: 'ntu', userId: 'user-1' });
        amplify.fetchAuthSession.mockResolvedValue(session('id-token-abc'));
        amplify.signIn.mockResolvedValue({ isSignedIn: true });
        amplify.signUp.mockResolvedValue({ isSignUpComplete: false });
        amplify.signOut.mockResolvedValue(undefined);
        amplify.confirmSignUp.mockResolvedValue({ isSignUpComplete: true });
        amplify.resendSignUpCode.mockResolvedValue({});
        amplify.resetPassword.mockResolvedValue({});
        amplify.confirmResetPassword.mockResolvedValue(undefined);
  });

  it('hydrates the signed-in user and id token on mount', async () => {
      renderAuth();
  
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('username')).toHaveTextContent('ntu');
      expect(screen.getByTestId('userId')).toHaveTextContent('user-1');
      await waitFor(() => expect(screen.getByTestId('token')).toHaveTextContent('id-token-abc'));
    });

  it('leaves the user null when there is no Cognito session', async () => {
      amplify.getCurrentUser.mockRejectedValue(new Error('not signed in'));
      amplify.fetchAuthSession.mockResolvedValue(session(undefined));
  
      renderAuth();
  
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('username')).toHaveTextContent('none');
      expect(screen.getByTestId('token')).toHaveTextContent('none');
    });

  it('signs a user in and exposes them as authenticated', async () => {
      amplify.getCurrentUser.mockRejectedValueOnce(new Error('not signed in'));
      const user = userEvent.setup();
      renderAuth();
      await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
  
      await user.click(screen.getByRole('button', { name: 'sign-in' }));
  
      expect(amplify.signIn).toHaveBeenCalledWith({ username: 'ntu@codeclash.dev', password: 'pw' });
      await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('true'));
      expect(screen.getByTestId('username')).toHaveTextContent('ntu');
    });

  
  it('surfaces the Cognito message when sign in fails', async () => {
      amplify.getCurrentUser.mockRejectedValue(new Error('not signed in'));
      amplify.signIn.mockRejectedValue(new Error('Incorrect username or password.'));
      const user = userEvent.setup();
      renderAuth();
  
      await user.click(screen.getByRole('button', { name: 'sign-in' }));
  
      await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('Incorrect username or password.'));
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

  it('falls back to a generic message when the rejection is not an Error', async () => {
    amplify.getCurrentUser.mockRejectedValue(new Error('not signed in'));
    amplify.signIn.mockRejectedValue('boom');
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole('button', { name: 'sign-in' }));

    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('Sign in failed'));
  });

  
  
})
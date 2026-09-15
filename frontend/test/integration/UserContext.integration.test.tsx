import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({
  get: vi.fn()
}));

vi.mock('src/services/api.services', () => ({ API: api }));

import { AuthContext, type AuthContextValue } from 'src/context/Auth/AuthContextValue';
import { UserProvider } from 'src/context/User/UserContext';
import { useUser } from 'src/context/User/hooks/useUser';
import { robot_map } from 'src/assets/Robots';

const AUTH_STUB: AuthContextValue = {
  user: { username: 'ntu', userId: 'user-1' },
  isAuthenticated: true,
  isLoading: false,
  error: null,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  confirmSignUp: vi.fn(),
  resendSignUpCode: vi.fn(),
  forgotPassword: vi.fn(),
  confirmForgotPassword: vi.fn(),
  clearError: vi.fn(),
  token: 'id-token-abc',
};

const UserConsumer = () => {
  const user = useUser();

  return (
    <div>
      <span data-testid="username">{user.username}</span>
      <span data-testid="userId">{user.userId}</span>
      <span data-testid="elo">{user.elo}</span>
      <span data-testid="league">{user.league}</span>
      <span data-testid="rank">{user.rank}</span>
      <span data-testid="avatar">{user.avatar || 'none'}</span>
      <span data-testid="current">{user.current_streak}</span>
      <span data-testid="winning">{user.winning_streak}</span>
      <span data-testid="error">{user.error || 'none'}</span>
      <button onClick={() => void user.refresh()}>refresh</button>
    </div>
  );
};

const renderUser = (auth: Partial<AuthContextValue> = {}, children: ReactNode = <UserConsumer />) =>
  render(
    <AuthContext.Provider value={{ ...AUTH_STUB, ...auth }}>
      <UserProvider>{children}</UserProvider>
    </AuthContext.Provider>,
  );

const respondWith = (overrides: Record<string, { status: number; data: any }> = {}) => {
  const table: Record<string, { status: number; data: any }> = {
    'elo/elo-get': { status: 200, data: { rating: 1420 } },
    'user/avatar_id': { status: 200, data: { avatar_id: 2 } },
    'user/league': { status: 200, data: { league: 'Gold' } },
    'user/rank': { status: 200, data: { rank: 7 } },
    'user/current_streak': { status: 200, data: { current_streak: 4 } },
    'user/winning_streak': { status: 200, data: { winning_streak: 3 } },
    ...overrides,
  };


  api.get.mockImplementation((url: string) => {
    const hit = table[url];
    if (!hit) return Promise.reject(new Error(`unexpected url ${url}`));
    if (hit instanceof Error) return Promise.reject(hit);
    return Promise.resolve(hit);
  });
};

describe('UserProvider integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    respondWith();
  });

  it('loads the whole profile once a token is available', async () => {
    renderUser();

    await waitFor(() => expect(screen.getByTestId('elo')).toHaveTextContent('1420'));
    expect(screen.getByTestId('league')).toHaveTextContent('Gold');
    expect(screen.getByTestId('rank')).toHaveTextContent('7');
    expect(screen.getByTestId('current')).toHaveTextContent('4');
    expect(screen.getByTestId('winning')).toHaveTextContent('3');
    expect(screen.getByTestId('avatar')).toHaveTextContent(robot_map[2]);
    expect(screen.getByTestId('error')).toHaveTextContent('none');
  });

  it('mirrors the identity from the auth context', async () => {
    renderUser();

    expect(screen.getByTestId('username')).toHaveTextContent('ntu');
    expect(screen.getByTestId('userId')).toHaveTextContent('user-1');
    await waitFor(() => expect(api.get).toHaveBeenCalled());
  });

  

  
});
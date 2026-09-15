import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

const api = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock('src/services/api.service', () => ({ API: api }));

const ws = vi.hoisted(() => ({ createSocket: vi.fn() }));
vi.mock('src/services/websocket.service', () => ws);

import { AchievementToastProvider } from 'src/context/Achievement/AchievementToastContext';
import { AuthProvider } from 'src/context/Auth/AuthContext';
import { useAuth } from 'src/context/Auth/hooks/useAuth';
import { useMatchmaking } from 'src/context/Socket/hooks/useMatchmaking';
import { useSocket } from 'src/context/Socket/hooks/useSocket';
import { MatchmakingProvider } from 'src/context/Socket/MatchmakingContext';
import { SocketProvider } from 'src/context/Socket/SocketContext';
import { ThemeProvider, useTheme } from 'src/context/ThemeContext';
import { useUser } from 'src/context/User/hooks/useUser';
import { UserProvider } from 'src/context/User/UserContext';
import type { MatchedUsersDTO } from 'src/dtos/matched-user.dto';

import { FakeSocket } from './helpers';

const MATCHED: MatchedUsersDTO = {
  players: {
    player_1: { id: 'user-1', elo: 1400, username: 'ntu' },
    player_2: { id: 'user-2', elo: 1390, username: 'rival' },
  },
  pair_id: 'pair-42',
  game_mode: 'math',
};

const Dashboard = () => {
  const auth = useAuth();
  const user = useUser();
  const { isConnected, socket } = useSocket();
  const mm = useMatchmaking();
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="username">{user.username || 'none'}</span>
      <span data-testid="elo">{user.elo}</span>
      <span data-testid="league">{user.league || 'none'}</span>
      <span data-testid="connected">{String(isConnected)}</span>
      <span data-testid="matched">{String(mm.matched)}</span>
      <span data-testid="opponent">{mm.matchedUsers?.players.player_2.username ?? 'none'}</span>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle-theme</button>
      <button
        onClick={() =>
          socket &&
          mm.joinMatchQueue(socket, {
            elo: user.elo,
            game_mode: 'math',
            game_type: 'ranked',
            username: user.username,
          })
        }
      >
        queue-up
      </button>
    </div>
  );
};

const renderApp = () =>
  render(
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <SocketProvider>
            <MatchmakingProvider>
              <AchievementToastProvider>
                <Dashboard />
              </AchievementToastProvider>
            </MatchmakingProvider>
          </SocketProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>,
  );

describe('app provider tree integration', () => {
  let socket: FakeSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    socket = new FakeSocket();
    ws.createSocket.mockResolvedValue(socket.asSocket());
    amplify.getCurrentUser.mockResolvedValue({ username: 'ntu', userId: 'user-1' });
    amplify.fetchAuthSession.mockResolvedValue({ tokens: { idToken: { toString: () => 'id-token-abc' } } });
    api.get.mockImplementation((url: string) =>
      Promise.resolve({
        status: 200,
        data: { rating: 1400, avatar_id: 1, league: 'Silver', rank: 12, current_streak: 2, winning_streak: 1 },
      }),
    );
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it('flows the Cognito token from auth through to the profile fetches', async () => {
    renderApp();

    await waitFor(() => expect(screen.getByTestId('authenticated')).toHaveTextContent('true'));
    await waitFor(() => expect(screen.getByTestId('elo')).toHaveTextContent('1400'));
    expect(screen.getByTestId('username')).toHaveTextContent('ntu');
    expect(screen.getByTestId('league')).toHaveTextContent('Silver');
    expect(api.get).toHaveBeenCalledWith('elo/elo-get', { headers: { Authorization: 'Bearer id-token-abc' } });
  });

  it('shares one socket between the socket and matchmaking providers', async () => {
    renderApp();
    await waitFor(() => expect(socket.handlers.has('users_matched')).toBe(true));

    act(() => socket.server('connect'));
    expect(screen.getByTestId('connected')).toHaveTextContent('true');

    act(() => socket.server('users_matched', MATCHED));
    expect(screen.getByTestId('matched')).toHaveTextContent('true');
    expect(screen.getByTestId('opponent')).toHaveTextContent('rival');
  });
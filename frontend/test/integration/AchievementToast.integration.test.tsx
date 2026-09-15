import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementToastProvider, useAchievementToast } from 'src/context/Achievement/AchievementToastContext';
import { AuthContext, type AuthContextValue } from 'src/context/Auth/AuthContextValue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

const EARNED_FIRST_BLOOD = {
  achievement_id: 'a-1',
  achievement_name: 'First Blood',
  description: 'Win your first ranked match',
};
const EARNED_GOLD_LEAGUE = {
  achievement_id: 'a-2',
  achievement_name: 'Gold League',
  description: 'Climb to Gold',
};
const EARNED_STREAK = {
  achievement_id: 'a-3',
  achievement_name: 'Five Day Streak',
  description: 'Play five days in a row',
};

const ManualTrigger = () => {
  const { showAchievement } = useAchievementToast();
  return (
    <button onClick={() => showAchievement({ name: 'Manual Medal', description: 'Pushed by hand', icon: 'medal' })}>
      trigger
    </button>
  );
};

const jsonResponse = (data: unknown) => ({ ok: true, json: () => Promise.resolve(data) });

const renderToasts = (auth: Partial<AuthContextValue> = {}) =>
  render(
    <AuthContext.Provider value={{ ...AUTH_STUB, ...auth }}>
      <AchievementToastProvider>
        <ManualTrigger />
      </AchievementToastProvider>
    </AuthContext.Provider>,
  );

describe('AchievementToastProvider integration', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('requests the earned achievements with the bearer token', async () => {
    renderToasts();

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/achievements/me', {
        headers: { Authorization: 'Bearer id-token-abc' },
      }),
    );
  });

  it('does not poll while the user is unauthenticated', () => {
    renderToasts({ token: undefined });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats the first fetch as a baseline and shows no toast', async () => {
    fetchMock.mockResolvedValue(jsonResponse([EARNED_FIRST_BLOOD]));

    renderToasts();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('Achievement Unlocked!')).toBeNull();
  });
  
});
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AchievementToastProvider, useAchievementToast } from '../../src/context/Achievement/AchievementToastContext';
import { AuthContext, type AuthContextValue } from '../../src/context/Auth/AuthContextValue';
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
  let achievementMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    achievementMock = vi.fn().mockResolvedValue(jsonResponse([]));
    fetchMock = vi.fn((url: string, ...rest: unknown[]) => {
      if (url === '/api/achievements/me') return new achievementMock(url, ...rest);
      return Promise.resolve(jsonResponse([]));
    });
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
     achievementMock.mockResolvedValue(jsonResponse([EARNED_FIRST_BLOOD]));

    renderToasts();

    await waitFor(() => expect(achievementMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('Achievement Unlocked!')).toBeNull();
  });

  it('toasts an achievement earned between two polls', async () => {
    achievementMock
        .mockResolvedValueOnce(jsonResponse([EARNED_FIRST_BLOOD]))
        .mockResolvedValue(jsonResponse([EARNED_FIRST_BLOOD, EARNED_GOLD_LEAGUE]));
  
      renderToasts();
       await waitFor(() => expect(achievementMock).toHaveBeenCalledTimes(1));
  
      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });
  
      expect(await screen.findByText('Gold League')).toBeInTheDocument();
      expect(screen.getByText('Climb to Gold')).toBeInTheDocument();
      expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
    });
  
    it('picks the icon from the achievement name', async () => {
      achievementMock
        .mockResolvedValueOnce(jsonResponse([]))
        .mockResolvedValue(jsonResponse([EARNED_STREAK]));
  
      const { container } = renderToasts();
      await waitFor(() => expect(achievementMock).toHaveBeenCalledTimes(1));
  
      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });
  
      expect(await screen.findByText('Five Day Streak')).toBeInTheDocument();
      expect(container.querySelector('.lucide-flame')).not.toBeNull();
    });
  
    it('shows queued achievements one at a time', async () => {
      achievementMock
        .mockResolvedValueOnce(jsonResponse([]))
        .mockResolvedValue(jsonResponse([EARNED_FIRST_BLOOD, EARNED_GOLD_LEAGUE]));
  
      renderToasts();
       await waitFor(() => expect(achievementMock).toHaveBeenCalledTimes(1));
  
      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });
  
      expect(await screen.findByText('First Blood')).toBeInTheDocument();
      expect(screen.queryByText('Gold League')).toBeNull();
  
      await act(async () => {
        await vi.advanceTimersByTimeAsync(4_300);
      });
  
      expect(await screen.findByText('Gold League')).toBeInTheDocument();
      expect(screen.queryByText('First Blood')).toBeNull();
    });
  
    it('does not re-toast an achievement that is already known', async () => {
      achievementMock
        .mockResolvedValueOnce(jsonResponse([]))
        .mockResolvedValue(jsonResponse([EARNED_FIRST_BLOOD]));
  
      renderToasts();
       await waitFor(() => expect(achievementMock).toHaveBeenCalledTimes(1));
  
      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });
      expect(await screen.findByText('First Blood')).toBeInTheDocument();
  
      await act(async () => {
        await vi.advanceTimersByTimeAsync(4_300);
      });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });
  
      expect(screen.queryByText('First Blood')).toBeNull();
    });
  
    it('dismisses a toast when it is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderToasts();
  
      await user.click(screen.getByRole('button', { name: 'trigger' }));
      expect(await screen.findByText('Manual Medal')).toBeInTheDocument();
  
      await user.click(screen.getByText('Manual Medal'));
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300);
      });
  
      expect(screen.queryByText('Manual Medal')).toBeNull();
    });
  
    it('ignores a non-ok response', async () => {
      achievementMock.mockResolvedValue({ ok: false, json: () => Promise.reject(new Error('unreachable')) });
  
      renderToasts();
  
      await waitFor(() => expect(achievementMock).toHaveBeenCalledTimes(1));
      expect(screen.queryByText('Achievement Unlocked!')).toBeNull();
    });
  
    it('logs and keeps polling when the request throws', async () => {
      const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
       achievementMock.mockRejectedValue(new Error('network down'));
  
      renderToasts();
  
      await waitFor(() => expect(quiet).toHaveBeenCalledWith('Error checking achievements:', expect.any(Error)));
  
      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });
      expect(achievementMock).toHaveBeenCalledTimes(2);
      quiet.mockRestore();
    });
  
    it('stops polling once the provider unmounts', async () => {
      const { unmount } = renderToasts();
       await waitFor(() => expect(achievementMock).toHaveBeenCalledTimes(1));
  
      unmount();
      await act(async () => {
        await vi.advanceTimersByTimeAsync(90_000);
      });
  
      expect(achievementMock).toHaveBeenCalledTimes(1);
    });
  
    it('throws when useAchievementToast is called outside the provider', () => {
      const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<ManualTrigger />)).toThrow('useAchievementToast must be used withing AchievementToastProvider');
      quiet.mockRestore();
    });
});
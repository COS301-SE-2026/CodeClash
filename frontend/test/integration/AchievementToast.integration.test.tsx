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
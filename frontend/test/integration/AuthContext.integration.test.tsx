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
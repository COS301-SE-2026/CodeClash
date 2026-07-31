import { createContext } from "react";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  resendSignUpCode: (username: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  confirmForgotPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  token: string | undefined;
}

export interface AuthUser {
  username: string;
  email?: string;
  userId: string;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

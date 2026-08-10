import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  getCurrentUser,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  fetchAuthSession
} from 'aws-amplify/auth'
import React, { useEffect, useState, useCallback, type ReactNode } from 'react'

import { AuthContext, type AuthUser } from './AuthContextValue'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | undefined>('');

  useEffect(() => {

    const loadUser = async () => {
      getCurrentUser()
        .then(async (cognitoUser) => {

          setUser({
            username: cognitoUser.username,
            userId: cognitoUser.userId,
          })

        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false)
        });
    }

    const fetchToken = async () => {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      setToken(idToken);
    }

    void loadUser();
    void fetchToken()
  }, [])

  const clearError = useCallback(() => setError(null), []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await amplifySignIn({ username: email, password });

      const cognitoUser = await getCurrentUser();

      setUser({
        username: cognitoUser.username,
        userId: cognitoUser.userId,
      })
    } catch (err: unknown) {
      setError((err instanceof Error) ? err.message : 'Sign in failed')
      throw err
    }
  }, []);

  const signUp = useCallback(async (data: { username: string; firstName: string; lastName: string; email: string; phoneNumber: string; password: string }) => {
    setError(null)
    try {
      await amplifySignUp({
        username: data.username,
        password: data.password,
        options: {
          userAttributes: {
            given_name: data.firstName,
            family_name: data.lastName,
            email: data.email,
            preferred_username: data.username,
            phone_number: data.phoneNumber,
            name: `${data.firstName} ${data.lastName}`,
          },
        },
      })
    } catch (err: unknown) {
      setError((err instanceof Error) ? err.message : 'Sign in failed')
      throw err
    }
  }, [])

  const confirmSignUp = useCallback(async (username: string, code: string) => {
    setError(null);
    try {
      await amplifyConfirmSignUp({ username, confirmationCode: code })
    } catch (err: unknown) {
      setError((err instanceof Error) ? err.message : 'Sign in failed')
      throw err
    }
  }, []);

  const resendSignUpCode = useCallback(async (username: string) => {
    setError(null);
    try {
      await amplifyResendSignUpCode({ username })
    } catch (err: unknown) {
      setError((err instanceof Error) ? err.message : 'Sign in failed')
      throw err
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    try {
      await amplifyResetPassword({ username: email });
    }
    catch (err: any) {
      setError(err?.message ?? "Failed to send reset code");
      throw err;
    }
  }, []);

  const confirmForgotPassword = useCallback(async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    setError(null);
    try {
      await amplifyConfirmResetPassword({ username: email, confirmationCode: code, newPassword, });
    }
    catch (err: any) {
      setError(err?.message ?? "Failed to reset password");
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await amplifySignOut()
      setUser(null)
    } catch (err: unknown) {
      setError((err instanceof Error) ? err.message : 'Sign in failed')
      throw err
    }
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        confirmSignUp,
        resendSignUpCode,
        forgotPassword,
        confirmForgotPassword,
        clearError,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



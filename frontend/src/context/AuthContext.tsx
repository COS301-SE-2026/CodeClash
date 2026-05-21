import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser, confirmSignUp as amplifyConfirmSignUp, resendSignUpCode as amplifyResendSignUpCode } from 'aws-amplify/auth'

interface AuthUser {
  username: string
  email?: string
  userId: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: { username: string; firstName: string; lastName: string; email: string; phoneNumber: string; password: string }) => Promise<void>
  signOut: () => Promise<void>
  confirmSignUp: (username: string, code: string) => Promise<void>
  resendSignUpCode: (username: string) => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCurrentUser()
      .then((cognitoUser) => {
        setUser({
          username: cognitoUser.username,
          userId: cognitoUser.userId,
        })
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      await amplifySignIn({ username: email, password })
      const cognitoUser = await getCurrentUser()
      setUser({
        username: cognitoUser.username,
        userId: cognitoUser.userId,
      })
    } catch (err: any) {
      setError(err?.message ?? 'Sign in failed')
      throw err
    }
  }, [])

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
    } catch (err: any) {
      setError(err?.message ?? 'Sign up failed')
      throw err
    }
  }, [])

  const confirmSignUp = useCallback(async (username: string, code: string) => {
    setError(null)
    try {
      await amplifyConfirmSignUp({ username, confirmationCode: code })
    } catch (err: any) {
      setError(err?.message ?? 'Confirmation failed')
      throw err
    }
  }, [])

  const resendSignUpCode = useCallback(async (username: string) => {
    setError(null)
    try {
      await amplifyResendSignUpCode({ username })
    } catch (err: any) {
      setError(err?.message ?? 'Failed to resend code')
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    try {
      await amplifySignOut()
      setUser(null)
    } catch (err: any) {
      setError(err?.message ?? 'Sign out failed')
    }
  }, [])

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
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

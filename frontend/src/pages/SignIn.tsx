import React, { useState } from "react";
import "./SignIn.css";
import googleIcon from "../assets/Google_Icon.png";
import appleIcon from "../assets/Apple_Icon.png";
import { useAuth } from "../context/AuthContext";

interface SignInProps {
  onBack: () => void;
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
  onSignUp: () => void;
  onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({
  onBack,
  onGoogleSignIn,
  onAppleSignIn,
  onSignUp,
  onSignIn,
}) => {
  const { signIn, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) { setLocalError("Email is required"); return false }
    if (!password) { setLocalError("Password is required"); return false }
    return true;
  };

  const handleSubmit = async () => {
    clearError();
    setLocalError(null);
    if (!validate()) return;
    try {
      await signIn(email.trim(), password);
      onSignIn();
    } catch {
      // error is set by context
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const displayError = localError ?? error;

  return (
    <div className="page-wrapper">
      <button className="back-button" onClick={onBack} type="button">
        ← Back
      </button>

      <div className="SignIn-container">
        <h1 className="SignIn-heading">Let's sign you in</h1>
        <p className="welcome-back">Welcome back!</p>

        {displayError && <p className="error-message">{displayError}</p>}

        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="email"
          disabled={isLoading}
        />

        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="current-password"
          disabled={isLoading}
        />

        <button className="signin-button" type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <div className="new-user-row">
          <span className="new-user-text">Forgot Password?</span>
        </div>

        <div className="or-divider">
          <div className="or-line" />
          <span className="or-text">or</span>
          <div className="or-line" />
        </div>

        <button className="social-button google" type="button" onClick={onGoogleSignIn} disabled={isLoading}>
          <img src={googleIcon} alt="Google" className="icon-google" />
          Sign in with Google
        </button>

        <button className="social-button apple" type="button" onClick={onAppleSignIn} disabled={isLoading}>
          <img src={appleIcon} alt="Apple" className="icon-apple" />
          Sign in with Apple
        </button>

        <div className="new-user-row">
          <span className="new-user-text">Are you a new user?</span>
          <button className="signup-link" type="button" onClick={onSignUp}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
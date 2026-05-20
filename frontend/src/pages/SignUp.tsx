import React, { useState } from "react";
import shieldImage from "../assets/LightMode_Shield.png";
import googleIcon from "../assets/Google_Icon.png";
import appleIcon from "../assets/Apple_Icon.png";
import { useAuth } from "../context/AuthContext";

interface SignUpProps {
  onBack?: () => void;
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
  onSignIn?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({
  onBack,
  onGoogleSignUp,
  onAppleSignUp,
  onSignIn,
}) => {
  const {
    signUp,
    confirmSignUp,
    resendSignUpCode,
    error,
    clearError,
    isLoading,
  } = useAuth();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!username.trim()) {
      setLocalError("Username is required");
      return false;
    }
    if (!firstName.trim()) {
      setLocalError("First name is required");
      return false;
    }
    if (!lastName.trim()) {
      setLocalError("Last name is required");
      return false;
    }
    if (!email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    if (!phoneNumber.trim()) {
      setLocalError("Phone number is required");
      return false;
    }
    if (!password || password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return false;
    }
    if (!acceptedTerms) {
      setLocalError("You must accept the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    clearError();
    setLocalError(null);
    if (!validate()) return;
    try {
      await signUp({
        username: username.trim(),
        firstName,
        lastName,
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
      });
      setNeedsConfirmation(true);
    } catch {
      // error set by context
    }
  };

  const handleConfirm = async () => {
    clearError();
    setLocalError(null);
    if (!confirmationCode.trim()) {
      setLocalError("Confirmation code is required");
      return;
    }
    try {
      await confirmSignUp(username.trim(), confirmationCode.trim());
      onSignIn?.();
    } catch {
      // error set by context
    }
  };

  const handleResend = async () => {
    clearError();
    setLocalError(null);
    setResendMessage(null);
    try {
      await resendSignUpCode(username.trim());
      setResendMessage("Code sent! Check your email.");
    } catch {
      // error set by context
    }
  };

  const displayError = localError ?? error;

  if (needsConfirmation) {
    return (
      <div className="page-wrapper">
        <button
          className="back-button"
          onClick={() => setNeedsConfirmation(false)}
          type="button"
        >
          ← Back
        </button>
        <img
          src={shieldImage}
          alt="C"
          className="shield-bg"
          aria-hidden="true"
        />
        <div className="signup-container">
          <h1 className="signup-heading">Verify your email</h1>
          <p style={{ marginBottom: "1rem" }}>Enter the code sent to {email}</p>
          {displayError && <p className="error-message">{displayError}</p>}
          {resendMessage && (
            <p
              style={{
                color: "#22c55e",
                fontSize: "0.875rem",
                textAlign: "center",
                marginBottom: "0.5rem",
              }}
            >
              {resendMessage}
            </p>
          )}
          <input
            className="input-field"
            type="text"
            placeholder="Confirmation code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="signup-button"
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Confirm"}
          </button>
          <button
            className="signup-button"
            type="button"
            onClick={() => resendSignUpCode(email.trim())}
            disabled={isLoading}
            style={{
              marginTop: "0.5rem",
              backgroundColor: "transparent",
              color: "#3b82f6",
              border: "1px solid #3b82f6",
            }}
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <button className="back-button" onClick={onBack} type="button">
        ← Back
      </button>

      <img src={shieldImage} alt="C" className="shield-bg" aria-hidden="true" />

      <div className="signup-container">
        <h1 className="signup-heading">Sign Up</h1>

        {displayError && <p className="error-message">{displayError}</p>}

        <input
          className="input-field"
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          disabled={isLoading}
        />

        <input
          className="input-field"
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          autoComplete="family-name"
          disabled={isLoading}
        />

        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          disabled={isLoading}
        />

        <input
          className="input-field"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={isLoading}
        />

        <input
          className="input-field"
          type="tel"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoComplete="tel"
          disabled={isLoading}
        />

        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={isLoading}
        />

        <div className="terms-row">
          <input
            className="terms-checkbox"
            type="checkbox"
            id="acceptTerms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            disabled={isLoading}
          />
          <label className="terms-label" htmlFor="acceptTerms">
            Accept <a href="#">Terms &amp; Conditions</a>
          </label>
        </div>

        <button
          className="signup-button"
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

        <div className="or-divider">
          <div className="or-line" />
          <span className="or-text">or</span>
          <div className="or-line" />
        </div>

        <button
          className="social-button google"
          type="button"
          onClick={onGoogleSignUp}
          disabled={isLoading}
        >
          <img src={googleIcon} alt="Google" className="icon-google" />
          Sign up with Google
        </button>

        <button
          className="social-button apple"
          type="button"
          onClick={onAppleSignUp}
          disabled={isLoading}
        >
          <img src={appleIcon} alt="Apple" className="icon-apple" />
          Sign up with Apple
        </button>
      </div>
    </div>
  );
};

export default SignUp;

import React, { useState } from 'react';
import './SignIn.css';
import shieldImage from '../assets/LightMode_Shield.png';
import googleIcon from '../assets/Google_Icon.png';
import appleIcon from '../assets/Apple_Icon.png';

interface SignInProps {
  onBack?: () => void;
  onSignIn?: (data: SignInData) => void;
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
  onSignUp?: () => void;
}

interface SignInData {
  email: string;
  password: string;
}

const SignIn: React.FC<SignInProps> = ({
  onBack,
  onSignIn,
  onGoogleSignIn,
  onAppleSignIn,
  onSignUp,
}) => {
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSignIn?.(formData);
  };

  return (
    <div className="page-wrapper">

      <button className="back-button" onClick={onBack} type="button">
        ← Back
      </button>

      <img src={shieldImage} alt="C" className="shield-bg" aria-hidden="true" />

      <div className="SignIn-container">

        <h1 className="SignIn-heading">Let's sign you in</h1>
        <p className="welcome-back">Welcome back!</p>

        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <button
          className="signin-button"
          type="button"
          onClick={handleSubmit}
        >
          Sign in
        </button>

        <div className="or-divider">
          <div className="or-line" />
          <span className="or-text">or</span>
          <div className="or-line" />
        </div>

        <button
          className="social-button google"
          type="button"
          onClick={onGoogleSignIn}
        >
          <img src={googleIcon} alt="Google" className="icon-google" />
          Sign in with Google
        </button>

        <button
          className="social-button apple"
          type="button"
          onClick={onAppleSignIn}
        >
          <img src={appleIcon} alt="Apple" className="icon-apple" />
          Sign in with Apple
        </button>

        <div className="new-user-row">
          <span className="new-user-text">Are you a new user?</span>
          <button
            className="signup-link"
            type="button"
            onClick={onSignUp}
          >
            Sign up
          </button>
        </div>

      </div>
    </div>
  );
};

export default SignIn;
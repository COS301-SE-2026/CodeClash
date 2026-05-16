import React, { useState } from 'react';
import './SignUp.css';
import shieldImage from '../assets/LightMode_Shield.png';
import googleIcon from '../assets/Google_Icon.png';
import appleIcon from '../assets/Apple_Icon.png';

interface SignUpProps {
  onBack?: () => void;
  onSignUp?: (data: SignUpData) => void;
  onGoogleSignUp?: () => void;
  onAppleSignUp?: () => void;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}

const SignUp: React.FC<SignUpProps> = ({
  onBack,
  onSignUp,
  onGoogleSignUp,
  onAppleSignUp,
}) => {
  const [formData, setFormData] = useState<SignUpData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acceptedTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = () => {
    onSignUp?.(formData);
  };

  return (
    <div className="page-wrapper">

      <button className="back-button" onClick={onBack} type="button">
        ← Back
      </button>

      <img src={shieldImage} alt="C" className="shield-bg" aria-hidden="true" />

      <div className="signup-container">

        <h1 className="signup-heading">Sign Up</h1>

        <input
          className="input-field"
          type="text"
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          autoComplete="given-name"
        />

        <input
          className="input-field"
          type="text"
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          autoComplete="family-name"
        />

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
          autoComplete="new-password"
        />

        <div className="terms-row">
          <input
            className="terms-checkbox"
            type="checkbox"
            id="acceptTerms"
            name="acceptedTerms"
            checked={formData.acceptedTerms}
            onChange={handleChange}
          />
          <label className="terms-label" htmlFor="acceptTerms">
            Accept <a href="#">Terms &amp; Conditions</a>
          </label>
        </div>

        <button
          className="signup-button"
          type="button"
          onClick={handleSubmit}
        >
          Sign up
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
        >
          <img src={googleIcon} alt="Google" className="icon-google" />
          Sign up with Google
        </button>

        <button
          className="social-button apple"
          type="button"
          onClick={onAppleSignUp}
        >
          <img src={appleIcon} alt="Apple" className="icon-apple" />
          Sign up with Apple
        </button>

      </div>
    </div>
  );
};

export default SignUp;
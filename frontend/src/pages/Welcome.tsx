import React from 'react';
import '../styles/Welcome.css';
import logoImage from '../assets/LightMode_Logo.png';

interface WelcomeProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="page-wrapper">
      <div className="welcome-container">
        <div className="logo-wrapper">
          <img src={logoImage} alt="CodeClash logo" className="logo-image" />
        </div>

        <h1 className="welcome-heading">Welcome to CodeClash Gaming</h1>

        <button
          className="signin-button"
          onClick={onSignIn}
          type="button"
        >
          Sign in
        </button>

        <div className="new-user-row">
          <span className="new-user-text">Are you a new user?</span>
          <button
            className="signup-link"
            onClick={onSignUp}
            type="button"
          >
            Sign up
          </button>
        </div>

      </div>
    </div>
  );
};

export default Welcome;
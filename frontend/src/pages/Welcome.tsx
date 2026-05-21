import React from 'react';
import logoImage from '../assets/LightMode_Logo.png';

interface WelcomeProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex items-center justify-center mb-[-16px]">
          <img
            src={logoImage}
            alt="CodeClash logo"
            className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[561px] lg:h-[561px] object-contain"
          />
        </div>

        <h1 className="font-['Baloo_Bhai_2'] font-bold text-4xl sm:text-5xl lg:text-6xl text-[#0f172a] leading-tight text-center mb-8">
          Welcome to CodeClash Gaming
        </h1>

        <button
          className="w-full max-w-md h-14 bg-[#3b82f6] border-none rounded-lg font-['Baloo_Bhai_2'] text-3xl font-semibold text-[#0f172a] cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[#2563eb] hover:-translate-y-px active:bg-[#1d4ed8] active:translate-y-0 mb-6"
          onClick={onSignIn}
          type="button"
        >
          Sign in
        </button>

        <div className="flex items-center gap-1.5">
          <span className="font-['Baloo_Bhai_2'] text-2xl text-[#0f172a]">Are you a new user?</span>
          <button
            className="font-['Baloo_Bhai_2'] text-2xl text-[#0f172a] underline cursor-pointer bg-none border-none p-0 transition-colors duration-150 hover:text-[#3b82f6]"
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
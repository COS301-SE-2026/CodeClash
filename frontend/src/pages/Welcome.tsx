import React from 'react';
import logoImage from '../assets/LightMode_Logo.png';

interface WelcomeProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="w-full min-h-screen bg-[#d2d2d2] flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex items-center justify-center mb-[-16px]">
          <img
            src={logoImage}
            alt="CodeClash logo"
            className="max-w-[90vw] w-[561px] h-auto object-contain"
          />
        </div>

        <h1 className="font-['Baloo_Bhai_2'] font-bold text-[2.5rem] sm:text-[3rem] lg:text-[4rem] text-[#0f172a] leading-[1.1] text-center mb-8">
          Welcome to CodeClash Gaming
        </h1>

        <button
          className="w-[500px] max-w-[90vw] h-[60px] bg-[#0e34a0] border-none rounded-[20px] font-['Baloo_Bhai_2'] text-[32px] font-[200] text-white cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-[#2563eb] hover:-translate-y-px active:bg-[#1d4ed8] active:translate-y-0 mb-6 [filter:drop-shadow(4px_4px_5px_rgba(0,0,0,0.3))]"
          onClick={onSignIn}
          type="button"
        >
          Sign in
        </button>

        <div className="flex items-center gap-[6px]">
          <span className="font-['Baloo_Bhai_2'] text-[24px] text-[#0f172a]">Are you a new user?</span>
          <button
            className="font-['Baloo_Bhai_2'] text-[24px] text-[#0f172a] underline cursor-pointer bg-transparent border-none p-0 transition-colors duration-150 hover:text-[#3b82f6]"
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
import React from 'react';
import logoImage from '../assets/LightMode_Logo.png';

interface WelcomeProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="bg-background flex items-center justify-center min-h-screen overflow-hidden ">
      <div className=" flex flex-col items-center fustify-center gap-0 w-[90%]">
        <div className="w-[100%] h-[100%] flex items-center justify-center ">
          <img src={logoImage} alt="CodeClash logo" className="w-[40%] h-[40%] object-contain rounded-xl " />
        </div>

        <h1 className="heading">Welcome to CodeClash Gaming</h1>

        <button
          className="
            w-[30%] h-[60%] rounded-xl flex items-center justify-center
            bg-primary text-primary-text
            font-family text-md font-semibold  
            tranform hover:scale-110 transition duration-200 ease-in-out
            active:bg-[#1d4ed8]
          "
          onClick={onSignIn}
          type="button"
        >
          Sign in
        </button>

        <div className="flex items-center gap-3 m-2">
          <span className="font-family text-sm">Are you a new user?</span>
          <button
            className="font-family text-sm font-semibold"
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
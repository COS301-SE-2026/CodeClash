import React from 'react';
import helloRobot from '../assets/HelloRobot_Pink.png';

interface WelcomeProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="bg-background min-h-screen w-full flex items-center overflow-hidden px-[8%]">

      {/* For the left column */}
      <div className=" flex flex-col justify-center gap-6 w-1/2">

        <div className="flex flex-col gap-1">
          <span className="text-text text-sm font-semibold">Welcome to</span>
          <h1 className="font-heading text-[length:--heading-size] font-[number:--heading-weight] text-text leading-tight">
            CodeClash Gaming
            </h1>
            <p className="text-text text-sm font-light">Code. Calculate. Conquer.</p>
        </div>

        

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
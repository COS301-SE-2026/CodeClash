import React from 'react';
import helloRobot from '../assets/HelloRobot_Pink.png';
import symbolBackground from '../assets/SymbolBackground.png';

interface WelcomeProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="min-h-screen w-full flex items-center overflow-hidden px-[8%]"
      style={{ background: 'radial-gradient(circle at 88% 88%, #B91551 0%, #850F3B 20%, #630B3C 30%, #530A24 38%)'}}>

        {/*Background frame*/}
        <img src={symbolBackground} alt="" className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
        />

      {/* For the left column */}
      <div className=" flex flex-col justify-center gap-6 w-1/2">

        <div className="flex flex-col gap-1">
          <span className="text-text text-sm font-semibold">Welcome to</span>
          <h1 className="font-heading text-[length:--heading-size] font-[number:--heading-weight] text-text leading-tight">
            CodeClash Gaming
            </h1>
            <p className="text-text text-sm font-light">Code. Calculate. Conquer.</p>
        </div>

      {/*For the button*/}
      <button
        className="
          w-[60%] rounded-xl bg-button-primary text-button-text-primary text-md font-extrabold py-4
          hover:scale-105 transition duration-200 ease-in-out"
        onClick={onSignUp}
        type="button"
      >
        Sign up
      </button>

      <div className="flex flex-col items-start gap-1">
        <span className="text-text text-sm">Already have an account?</span>
        <button 
          className="
          text-text text-sm font-semibold underline"
          onClick={onSignIn}
          type="button"
        >
          Sign in
        </button>
      </div>

      </div>

      {/* For the right column (robot)*/}
      <div className="w-1/2 flex items-center justify-center">    
        <img src={helloRobot} alt="CodeClash Robot Avatar" className="w-[105%] h-auto object-contain mix-blend-screen -translate-x-10 translate-y-18"/>
      </div>

    </div>
  );
};

export default Welcome;
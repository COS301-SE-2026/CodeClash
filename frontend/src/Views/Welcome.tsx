import React from 'react';
import helloRobot from '../assets/HelloRobot_Pink.png';
import symbolBackground from '../assets/SymbolBackground.png';
import { Link } from 'react-router-dom';
import { WelcomeViewModelFunction } from '../ViewModels/WelcomeViewModel.ts';
import type { WelcomeViewModelProps } from '../ViewModels/WelcomeViewModel.ts';

interface WelcomeProps extends WelcomeViewModelProps { }

const Welcome: React.FC<WelcomeProps> = ({ onSignIn, onSignUp }) => {
  const { content} = WelcomeViewModelFunction({
    onSignIn,
    onSignUp,
  });

  return (
    <div className="min-h-screen w-full flex items-center overflow-hidden px-[8%]"
      style={{ background: 'radial-gradient(circle at 88% 88%, #B91551 0%, #850F3B 20%, #630B3C 30%, #530A24 38%)' }}>

      {/*Background frame*/}
      <img src={symbolBackground} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* For the left column */}
      <div className=" flex flex-col justify-center gap-6 w-1/2 z-10">

        <div className="flex flex-col gap-1">
          <span className={content.eyebrow.style.className}>{content.eyebrow.text}</span>
          <h1 className={content.title.style.className}>{content.title.text}</h1>
          <p className={content.tagline.style.className}>{content.tagline.text}</p>
        </div>

        {/*For the button*/}
        <Link
          className=" text-center
          w-[60%] rounded-xl bg-button-primary text-button-text-primary text-md font-extrabold py-4
          hover:scale-105 transition duration-200 ease-in-out"
          type="button"
          to='/sign-up'
        >
          Sign up
        </Link>

        <div className="flex flex-col items-center gap-1 w-[60%]">
          <span className="text-primary-text text-sm font-heading">Already have an account?</span>
          <Link
            className=" text-primary-text text-sm underline"
            to="/sign-in"
          >
            Sign in
          </Link>
        </div>

      </div>

      {/* For the right column (robot)*/}
      <div className="w-1/2 flex items-center justify-center z-10">
        <img src={helloRobot} alt="CodeClash Robot Avatar" className="w-[105%] h-auto object-contain mix-blend-multiply -translate-x-10 translate-y-18" />
      </div>

    </div>
  );
};

export default Welcome;
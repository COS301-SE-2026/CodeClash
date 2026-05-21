/* The backbutton can be used for the following: 
    "← Back" button on SignIn, SignUp, Profile, Arena pages 

This is how it would be called in its necessary files:
    import BackButton from '@/components/backbutton'
    <BackButton onClick={fn} />
    <BackButton label="← Back" onClick={fn} />   this accomodates for custom label if needed
*/

import React from 'react';

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label     = '← Back',
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'w-[91px] h-[31px]',
      'flex items-center justify-center',
      'bg-white border border-[#0f172a] rounded-md',
      'font-baloo text-[16px] text-[#0f172a]',
      'transition-colors duration-150 hover:bg-slate-100 cursor-pointer',
      className,
    ].join(' ')}
  >
    {label}
  </button>
);

export default BackButton;
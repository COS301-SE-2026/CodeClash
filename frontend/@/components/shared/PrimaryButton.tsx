/* The primarybutton can be used for the following: 
  "Sign in" button on Welcome page (variant="blue")
  "Sign up" / "Sign in" form buttons (variant="blue") 
  "Play Now >" casual card button (variant="purple")
  "Play Now >" ranked card button (variant="blue")

This is how it would be called in its necessary files:
  import PrimaryButton from '@/components/primarybutton'
  <PrimaryButton variant="blue" onClick={fn}>Sign in</PrimaryButton>
  <PrimaryButton variant="purple" size="play" onClick={fn}>Play Now &gt;</PrimaryButton>
*/

import React from 'react';

type Variant = 'blue' | 'purple';
type Size    = 'default' | 'play';   //the play buttons are sized a bit differently to fit its container better

interface PrimaryButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

const styles: Record<Variant, string> = {
  blue:   'bg-[#3b82f6] hover:bg-[#2563eb] active:bg-[#1d4ed8]',
  purple: 'bg-[#a78bfa] hover:bg-[#9061f9] active:bg-[#7c3aed]',
};

const sizes: Record<Size, string> = {
  default: 'w-[500px] h-[60px] text-[32px]',
  play:    'w-[490px] h-[63px] text-[32px]',
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant  = 'blue',
  size     = 'default',
  onClick,
  type     = 'button',
  disabled = false,
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={[
      'flex items-center justify-center',
      sizes[size],
      styles[variant],
      size === 'default' ? 'border-2' : 'border',
      'border-[#0f172a] rounded-lg',
      'font-baloo font-semibold text-[#0f172a]',
      'transition-all duration-200 cursor-pointer',
      'hover:-translate-y-px active:translate-y-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      className,
    ].join(' ')}
  >
    {children}
  </button>
);

export default PrimaryButton;
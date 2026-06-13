/* The socialbutton can be used for the following: 
    "Sign up / Sign in with Google", provider="google", fill #A78BFA
    "Sign up / Sign in with Apple", provider="apple", fill #3B82F6

This is how it would be called in its necessary files:
    import SocialButton from '@/components/socialbutton'
    import googleIcon from '@/assets/Google_Icon.png'
    import appleIcon  from '@/assets/Apple_Icon.png'
    <SocialButton provider="google" icon={googleIcon} onClick={fn}>Sign up with Google</SocialButton>
    <SocialButton provider="apple"  icon={appleIcon}  onClick={fn}>Sign up with Apple</SocialButton>
*/

import React from 'react';

type Provider = 'google' | 'apple';

interface SocialButtonProps {
  provider: Provider;
  icon: string;                 //imported PNG icons
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const providerStyles: Record<Provider, string> = {
  google: 'bg-[#a78bfa] hover:bg-[#9061f9]',
  apple:  'bg-[#3b82f6] hover:bg-[#2563eb]',
};

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  icon,
  children,
  onClick,
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'w-[500px] h-[60px]',
      'flex items-center justify-center gap-3',
      providerStyles[provider],
      'border border-[#0f172a] rounded-lg',
      'font-baloo font-semibold text-[24px] text-[#0f172a]',
      'transition-all duration-200',
      'hover:opacity-[0.88] hover:-translate-y-px active:translate-y-0',
      className,
    ].join(' ')}
  >
    <img src={icon} alt={provider} className="w-7 h-7 object-contain" />
    {children}
  </button>
);

export default SocialButton;
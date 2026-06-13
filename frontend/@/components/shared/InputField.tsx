/* The inputfield can be used for the following: 
    First name, Last name, Email address, Password fields on SignUp
    Email address, Password fields on SignIn

This is how it would be called in its necessary files:
    import InputField from '@/components/inputfield'
    <InputField name="email" placeholder="Email address" type="email" value={val} onChange={fn} />
*/

import React from 'react';

interface InputFieldProps {
  name: string;
  placeholder: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  placeholder,
  type         = 'text',
  value,
  onChange,
  autoComplete,
  className    = '',
}) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    autoComplete={autoComplete}
    className={[
      'w-[500px] h-[60px] px-5',
      'bg-white border border-[#0f172a] rounded-lg',
      'font-baloo text-[24px]',
      'text-[#0f172a]/60 placeholder:text-[#0f172a]/60',
      'outline-none',
      'focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[#3b82f6]/15 focus:text-[#0f172a]',
      'transition-all duration-200',
      className,
    ].join(' ')}
  />
);

export default InputField;
import React from 'react';
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface BackButtonProps {
  page: string
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  page,
  className,
}) => (
  <Link
    type="button"
    to={page}
    className={cn('w-[91px] h-[31px]',
      'flex items-center justify-center',
      'bg-white border border-[#0f172a] rounded-md',
      'font-baloo text-[16px] text-[#0f172a]',
      'transition-colors duration-150 hover:bg-slate-100 cursor-pointer', className)}
  >
    ← Back
  </Link>
);

export default BackButton;
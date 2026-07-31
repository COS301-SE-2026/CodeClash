import React from 'react';
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

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
    className={cn('secondary-back-button font-semibold ',
      'transition duration-150 hover:scale(110) cursor-pointer', className)}
  >
    ← Back
  </Link>
);

export default BackButton;
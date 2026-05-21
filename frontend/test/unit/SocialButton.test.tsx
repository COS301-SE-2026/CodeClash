import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialButton from '../../@/components/shared/SocialButton';
import '@testing-library/jest-dom';

const mockIcon = "icon.png";

describe('SocialButton', () => {
  it('renders children text', () => {
    render(<SocialButton provider="google" icon={mockIcon}>Sign up with Google</SocialButton>);
    expect(screen.getByRole('button', { name: /sign up with google/i })).toBeInTheDocument();
  });

  it('renders as a <button> element', () => {
    render(<SocialButton provider="google" icon={mockIcon}>Sign up with Google</SocialButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

   it('always has type="button"', () => {
    render(<SocialButton provider="google" icon={mockIcon}>Sign up with Google</SocialButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
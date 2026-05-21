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

  it('applies purple background for google provider', () => {
    render(<SocialButton provider="google" icon={mockIcon}>Sign up with Google</SocialButton>);
    expect(screen.getByRole('button').className).toContain('bg-[#a78bfa]');
  });

  it('applies blue background for apple provider', () => {
    render(<SocialButton provider="apple" icon={mockIcon}>Sign up with Apple</SocialButton>);
    expect(screen.getByRole('button').className).toContain('bg-[#3b82f6]');
  });

  it('renders the icon image', () => {
    render(<SocialButton provider="google" icon={mockIcon}>Sign up with Google</SocialButton>);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockIcon);
  });

   it('applies correct size classes', () => {
    render(<SocialButton provider="google" icon={mockIcon}>Sign up with Google</SocialButton>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('w-[500px]');
    expect(btn.className).toContain('h-[60px]');
  });
});
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PrimaryButton from '../../@/components/shared/PrimaryButton';

describe('PrimaryButton', () => {

  it('renders children text', () => {
    render(<PrimaryButton>Sign in</PrimaryButton>);
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders as a <button> element', () => {
    render(<PrimaryButton>Sign in</PrimaryButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has type="button" by default', () => {
    render(<PrimaryButton>Sign in</PrimaryButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('respects type="submit"', () => {
    render(<PrimaryButton type="submit">Submit</PrimaryButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('applies blue background class by default', () => {
    render(<PrimaryButton>Sign in</PrimaryButton>);
    expect(screen.getByRole('button').className).toContain('bg-[#3b82f6]');
  });

  it('applies purple background class when variant="purple"', () => {
    render(<PrimaryButton variant="purple">Play Now</PrimaryButton>);
    expect(screen.getByRole('button').className).toContain('bg-[#a78bfa]');
  });

  it('applies default size classes (500x60)', () => {
    render(<PrimaryButton>Sign in</PrimaryButton>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('w-[500px]');
    expect(btn.className).toContain('h-[60px]');
  });

  it('applies play size classes (490x63) when size="play"', () => {
    render(<PrimaryButton size="play">Play Now</PrimaryButton>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('w-[490px]');
    expect(btn.className).toContain('h-[63px]');
  });

  it('uses border-2 for default size (primary action)', () => {
    render(<PrimaryButton>Sign in</PrimaryButton>);
    expect(screen.getByRole('button').className).toContain('border-2');
  });

  it('uses border (1px) for play size', () => {
    render(<PrimaryButton size="play">Play Now</PrimaryButton>);
    const cls = screen.getByRole('button').className;
    // should have 'border' but not 'border-2'
    expect(cls).toMatch(/\bborder\b/);
    expect(cls).not.toContain('border-2');
  });

  it('calls onClick when clicked', () => {
    const handler = vi.fn();
    render(<PrimaryButton onClick={handler}>Sign in</PrimaryButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handler = vi.fn();
    render(<PrimaryButton onClick={handler} disabled>Sign in</PrimaryButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<PrimaryButton disabled>Sign in</PrimaryButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('merges extra className', () => {
    render(<PrimaryButton className="mt-4">Sign in</PrimaryButton>);
    expect(screen.getByRole('button').className).toContain('mt-4');
  });
});
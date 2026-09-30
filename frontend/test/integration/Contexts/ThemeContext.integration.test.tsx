import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../../../src/context/Shop/ThemeContext';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const THEME_KEY = 'codeclash-themes';

const ThemeConsumer = () => {
  const { theme, isLight, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isLight">{String(isLight)}</span>
      <button onClick={toggleTheme}>toggle</button>
      <button onClick={() => setTheme('light')}>go-light</button>
      <button onClick={() => setTheme('dark')}>go-dark</button>
    </div>
  );
};

const renderTheme = () =>
  render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>,
  );

describe('ThemeProvider integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('light');
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('defaults to dark and persists that choice', () => {
    renderTheme();

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('isLight')).toHaveTextContent('false');
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(window.localStorage.getItem(THEME_KEY)).toBe('dark');
  });

  it('restores a stored light theme on mount', () => {
    window.localStorage.setItem(THEME_KEY, 'light');

    renderTheme();

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('isLight')).toHaveTextContent('true');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('treats any other stored value as dark', () => {
    window.localStorage.setItem(THEME_KEY, 'solarized');

    renderTheme();

    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles back and forth, updating the document class and storage', async () => {
    const user = userEvent.setup();
    renderTheme();

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(window.localStorage.getItem(THEME_KEY)).toBe('light');

    await user.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(window.localStorage.getItem(THEME_KEY)).toBe('dark');
  });

  it('sets an explicit theme and is idempotent', async () => {
     const user = userEvent.setup();
     renderTheme();
 
     await user.click(screen.getByRole('button', { name: 'go-light' }));
     await user.click(screen.getByRole('button', { name: 'go-light' }));
     expect(screen.getByTestId('theme')).toHaveTextContent('light');
 
     await user.click(screen.getByRole('button', { name: 'go-dark' }));
     expect(screen.getByTestId('theme')).toHaveTextContent('dark');
   });
 
   it('throws when useTheme is called outside the provider', () => {
     const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
     expect(() => render(<ThemeConsumer />)).toThrow('useTheme must be within a ThemeProvider');
     quiet.mockRestore();
   });

});
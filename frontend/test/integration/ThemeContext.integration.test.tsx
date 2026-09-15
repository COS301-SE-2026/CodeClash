import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from 'src/context/ThemeContext';
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
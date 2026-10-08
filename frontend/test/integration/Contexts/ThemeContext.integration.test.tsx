import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../../../src/context/Shop/ThemeContext';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const THEME_KEY = 'codeclash-themes';

// ThemeProvider reads the signed-in user and their equipped theme; both are controlled per test
const authState: { user: { username: string; userId: string } | null; isLoading: boolean } = {
  user: { username: 'tester', userId: 'user-1' },
  isLoading: false,
};
const inventoryState: { catalog: unknown[]; inventory: { equippedThemeId: string | null } | null } = {
  catalog: [],
  inventory: null,
};

vi.mock('src/context/Auth/hooks/useAuth', () => ({ useAuth: () => authState }));
vi.mock('src/context/Shop/InventoryContext', () => ({ useInventory: () => inventoryState }));

const frostItem = { id: 'item-frost', category: 'theme', themeId: 'frost' };

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
    authState.user = { username: 'tester', userId: 'user-1' };
    authState.isLoading = false;
    inventoryState.catalog = [];
    inventoryState.inventory = null;
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
 
   it('keeps the stored theme while auth is still loading', () => {
     window.localStorage.setItem(THEME_KEY, 'light');
     authState.user = null;
     authState.isLoading = true;

     renderTheme();

     expect(screen.getByTestId('theme')).toHaveTextContent('light');
     expect(window.localStorage.getItem(THEME_KEY)).toBe('light');
   });

   it('resets to dark and clears storage once auth finishes with no user', () => {
     window.localStorage.setItem(THEME_KEY, 'light');
     authState.user = null;

     renderTheme();

     expect(screen.getByTestId('theme')).toHaveTextContent('dark');
     expect(window.localStorage.getItem(THEME_KEY)).toBeNull();
   });

   it('adopts the equipped theme from the server over the stored one', () => {
     window.localStorage.setItem(THEME_KEY, 'light');
     inventoryState.catalog = [frostItem];
     inventoryState.inventory = { equippedThemeId: 'item-frost' };

     renderTheme();

     expect(screen.getByTestId('theme')).toHaveTextContent('frost');
     expect(document.documentElement.classList.contains('frost')).toBe(true);
     expect(window.localStorage.getItem(THEME_KEY)).toBe('frost');
   });

   it('throws when useTheme is called outside the provider', () => {
     const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
     expect(() => render(<ThemeConsumer />)).toThrow('useTheme must be within a ThemeProvider');
     quiet.mockRestore();
   });

});
import { render, screen } from '@testing-library/react';
import {ProgMatch} from '../../src/Views/Match/ProgMatch';
import { describe, expect, it } from 'vitest';

describe('ProgMatch page', () => {
  it('renders the full-screen match shell', () => {
    const { container } = render(<ProgMatch/>);

    const shell = container.firstElementChild!;
    expect(shell).toBeInTheDocument();
    expect(shell.className).toContain('fixed');
    expect(shell.className).toContain('inset-0');
  });

  it('renders no match content while the board is still stubbed out', () => {
    render(<ProgMatch/>);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('renders the same shell whichever language is selected', () => {
    const { container: python } = render(<ProgMatch/>);
    const { container: java } = render(<ProgMatch />);

    expect(java.innerHTML).toBe(python.innerHTML);
  });
});

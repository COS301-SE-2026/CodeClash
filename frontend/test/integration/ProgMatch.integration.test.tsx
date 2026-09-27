import { render, screen } from '@testing-library/react';
import {ProgMatch} from '../../src/Views/Match/ProgMatch';
import { describe, expect, it, vi } from 'vitest';

vi.mock('src/ViewModels/Match/MatchViewModel', () => ({ useMatch: () => ({ loading: true, questions: [], currentQuestion: 0 }) }));

      describe('ProgMatch page', () => {
        it('renders the full-screen loading overlay while the match loads', () => {
          const { container } = render(<ProgMatch />);

          const shell = container.firstElementChild!;
          expect(shell).toBeInTheDocument();
          expect(shell.className).toContain('fixed');
          expect(shell.className).toContain('inset-0');
        });

        it('renders no match content while the match loads', () => {
          render(<ProgMatch />);

          expect(screen.queryByRole('button')).toBeNull();
          expect(screen.queryByRole('link')).toBeNull();
        });

        it('renders the same overaly on every mount', () => {
          const { container: python } = render(<ProgMatch />);
          const { container: java } = render(<ProgMatch />);

          expect(java.innerHTML).toBe(python.innerHTML);
        });
      });


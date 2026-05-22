import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchProgress } from '../../@/components/features/match-progress';
import type { QuestionDTO } from 'src/types/question.dto';

// mocking door image import
vi.mock('../../../src/assets/door.png', () => ({ default: 'door.png' }));

const mockQuestions: QuestionDTO[] = [
  { id: 1, question: 'Q1' } as QuestionDTO,
  { id: 2, question: 'Q2' } as QuestionDTO,
  { id: 3, question: 'Q3' } as QuestionDTO,
];

const baseProps = {
  questions: mockQuestions,
  avatar: 'avatar.png',
  opponent: 'opponent.png',
  progress: 0,
  opponent_progress: 0,
  done: false,
  opponent_done: false,
};

describe('MatchProgress - rendering', () => {
  it('renders the Badge on finish', () => {
    render(<MatchProgress {...baseProps} />);
    expect(screen.getByText('Finish')).toBeInTheDocument();
  });

})

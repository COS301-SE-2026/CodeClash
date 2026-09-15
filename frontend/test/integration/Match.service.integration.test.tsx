import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameQuestionsDTO } from 'src/dtos/game-questionDTO';
import type { Player } from 'src/Models/MatchModel';

const nav = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (original) => ({
  ...(await original<typeof import('react-router-dom')>()),
  useNavigate: () => nav,
}));

import {
  useGameQuestions,
  useGameTimer,
  useMatchProgress,
  useMathSubmission,
  useProgSubmission,
} from 'src/services/match.service';

import { FakeSocket } from './helpers';

const MATCH_ID = '77';
const USER_ID = 'user-1';

const QUESTIONS: GameQuestionsDTO = {
  easy: [{ id: 'q-easy', title: 'Two Sum', description: 'add two numbers', time_limit: '00:05:00' }],
  medium: [{ id: 'q-medium', title: 'Binary Search', description: 'find it fast', time_limit: '00:10:00' }],
  hard: [{ id: 'q-hard', title: 'N Queens', description: 'place the queens', time_limit: '00:15:00' }],
};

const PLAYERS: Player[] = [
  { id: 'user-1', life: 100 } as Player,
  { id: 'user-2', life: 100 } as Player,
];

const QuestionsHarness = ({ socket }: { socket: FakeSocket }) => {
  const game = useGameQuestions(MATCH_ID, USER_ID, socket.asSocket(), 'ranked');

  return (
    <div>
      <span data-testid="ready">{String(game.questionsReady)}</span>
      <span data-testid="count">{game.questions.length}</span>
      <span data-testid="current">{game.currentQuestion}</span>
      <span data-testid="duration">{game.duration}</span>
      <span data-testid="waiting">{String(game.waitingOpponent)}</span>
      <span data-testid="titles">{game.questions.map((q) => q.title).join(',')}</span>
      <span data-testid="difficulties">{game.questions.map((q) => q.difficulty).join(',')}</span>
      <button onClick={() => game.loadQuestions(QUESTIONS)}>load</button>
      <button onClick={() => game.nextQuestion(game.currentQuestion)}>next</button>
      <button onClick={() => game.prevQuestion(game.currentQuestion)}>prev</button>
      <button onClick={() => game.submitQuestion('q-easy', 'prog', { source_code: 'x', language_id: 71, stdin: null })}>
        submit
      </button>
      <button onClick={game.finishGame}>finish</button>
      <button onClick={game.waiting_opponent}>wait</button>
      <button onClick={game.both_done}>both-done</button>
    </div>
  );
};

const renderQuestions = (socket: FakeSocket) =>
  render(
    <MemoryRouter>
      <QuestionsHarness socket={socket} />
    </MemoryRouter>,
  );

const goToLastQuestion = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'load' }));
  await user.click(screen.getByRole('button', { name: 'next' }));
  await user.click(screen.getByRole('button', { name: 'next' }));
};

describe('useGameQuestions integration', () => {
  let socket: FakeSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    socket = new FakeSocket();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts empty and not ready', () => {
    renderQuestions(socket);

    expect(screen.getByTestId('ready')).toHaveTextContent('false');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('duration')).toHaveTextContent('0');
  });

  it('flattens the difficulty buckets and sums their time limits', async () => {
    const user = userEvent.setup();
    renderQuestions(socket);

    await user.click(screen.getByRole('button', { name: 'load' }));

    expect(screen.getByTestId('ready')).toHaveTextContent('true');
    expect(screen.getByTestId('count')).toHaveTextContent('3');
    expect(screen.getByTestId('duration')).toHaveTextContent('30');
    expect(screen.getByTestId('titles')).toHaveTextContent('Two Sum');
    expect(screen.getByTestId('difficulties').textContent!.split(',').sort()).toEqual(['Easy', 'Hard', 'Medium']);
  });

  it('announces the first question as soon as the set loads', async () => {
    const user = userEvent.setup();
    renderQuestions(socket);

    await user.click(screen.getByRole('button', { name: 'load' }));

    const started = socket.emitsOf('question_started');
    expect(started).toHaveLength(1);
    expect(started[0][0]).toMatchObject({ match_id: MATCH_ID, player: USER_ID, question_number: 0 });
  });
  
});
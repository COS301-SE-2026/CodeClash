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

  it('walks forwards and backwards through the questions', async () => {
      const user = userEvent.setup();
      renderQuestions(socket);
      await user.click(screen.getByRole('button', { name: 'load' }));
  
      await user.click(screen.getByRole('button', { name: 'next' }));
      expect(screen.getByTestId('current')).toHaveTextContent('1');
  
      await user.click(screen.getByRole('button', { name: 'prev' }));
      expect(screen.getByTestId('current')).toHaveTextContent('0');
  
      expect(socket.emitsOf('question_started').map((a) => a[0].question_number)).toEqual([0, 1, 0]);
    });
  
    it('will not walk past either end of the question list', async () => {
      const user = userEvent.setup();
      renderQuestions(socket);
      await user.click(screen.getByRole('button', { name: 'load' }));
  
      await user.click(screen.getByRole('button', { name: 'prev' }));
      expect(screen.getByTestId('current')).toHaveTextContent('0');
  
      await goToLastQuestion(user);
      expect(screen.getByTestId('current')).toHaveTextContent('2');
  
      const before = socket.emitsOf('question_started').length;
      await user.click(screen.getByRole('button', { name: 'next' }));
      expect(screen.getByTestId('current')).toHaveTextContent('2');
      expect(socket.emitsOf('question_started')).toHaveLength(before);
    });
  
    it('submits the answer for the question the player is on', async () => {
      const user = userEvent.setup();
      renderQuestions(socket);
      await user.click(screen.getByRole('button', { name: 'load' }));
      await user.click(screen.getByRole('button', { name: 'next' }));
  
      await user.click(screen.getByRole('button', { name: 'submit' }));
  
      expect(socket.emitsOf('submit_prog_question')).toEqual([
        [
          {
            match_id: 77,
            question_id: 'q-easy',
            question_number: 1,
            submission: { source_code: 'x', language_id: 71, stdin: null },
          },
        ],
      ]);
    });

    it('only ends the game from the last question', async () => {
       const user = userEvent.setup();
       renderQuestions(socket);
       await user.click(screen.getByRole('button', { name: 'load' }));
   
       await user.click(screen.getByRole('button', { name: 'finish' }));
       expect(socket.emitsOf('game_done')).toHaveLength(0);
       expect(screen.getByTestId('waiting')).toHaveTextContent('false');
   
       await user.click(screen.getByRole('button', { name: 'next' }));
       await user.click(screen.getByRole('button', { name: 'next' }));
       await user.click(screen.getByRole('button', { name: 'finish' }));
   
       expect(socket.emitsOf('game_done')).toEqual([[77, 'ranked']]);
       expect(screen.getByTestId('waiting')).toHaveTextContent('true');
     });
   
     it('flags and clears the waiting-for-opponent state', async () => {
       const user = userEvent.setup();
       renderQuestions(socket);
   
       await user.click(screen.getByRole('button', { name: 'wait' }));
       expect(screen.getByTestId('waiting')).toHaveTextContent('true');
   
       await user.click(screen.getByRole('button', { name: 'both-done' }));
       expect(screen.getByTestId('waiting')).toHaveTextContent('false');
     });
   
     it('navigates to the results screen when both players finish', async () => {
       const user = userEvent.setup();
       renderQuestions(socket);
   
       await user.click(screen.getByRole('button', { name: 'both-done' }));
   
       expect(nav).toHaveBeenCalledWith('/results', { replace: true, state: { id: MATCH_ID } });
     });
   });
   
   const ProgressHarness = ({ players, numQuestions }: { players: Player[]; numQuestions: number }) => {
     const progress = useMatchProgress(numQuestions, players);
   
     return (
       <div>
         <span data-testid="life">{progress.playerLife.join(',')}</span>
         <span data-testid="opponentCurrent">{progress.opponentCurrent}</span>
         <span data-testid="opponentDone">{String(progress.opponentDone)}</span>
         <button
           onClick={() =>
             progress.opponent_progress({ player_id: 'user-2', correct: true, opponent_life: 80, question: 0 })
           }
         >
           opponent-advances
         </button>
         <button
           onClick={() =>
             progress.opponent_progress({ player_id: 'ghost', correct: true, opponent_life: 10, question: 1 })
           }
         >
           unknown-player
         </button>
         <button
           onClick={() =>
             progress.opponent_progress({ player_id: 'user-2', correct: false, opponent_life: 40, question: 9 })
           }
         >
           opponent-overruns
         </button>
         <button onClick={progress.opponent_done}>opponent-done</button>
         <button onClick={() => progress.updatePlayerLife('user-1', 60)}>hurt-me</button>
         <button onClick={() => progress.updatePlayerLife('ghost', 0)}>hurt-ghost</button>
       </div>
     );
   };
   
   describe('useMatchProgress integration', () => {
     it('seeds each player life from the roster', () => {
       render(<ProgressHarness players={PLAYERS} numQuestions={3} />);
   
       expect(screen.getByTestId('life')).toHaveTextContent('100,100');
       expect(screen.getByTestId('opponentCurrent')).toHaveTextContent('0');
       expect(screen.getByTestId('opponentDone')).toHaveTextContent('false');
     });
   
     it('re-seeds when the roster changes', () => {
       const { rerender } = render(<ProgressHarness players={PLAYERS} numQuestions={3} />);
   
       rerender(<ProgressHarness players={[{ id: 'user-1', life: 50 } as Player]} numQuestions={3} />);
   
       expect(screen.getByTestId('life')).toHaveTextContent('50');
     });
   
     it('advances the opponent pointer and drops their life', async () => {
       const user = userEvent.setup();
       render(<ProgressHarness players={PLAYERS} numQuestions={3} />);
   
       await user.click(screen.getByRole('button', { name: 'opponent-advances' }));
   
       expect(screen.getByTestId('opponentCurrent')).toHaveTextContent('1');
       expect(screen.getByTestId('life')).toHaveTextContent('100,80');
     });
   
     it('clamps the opponent pointer to the last question', async () => {
       const user = userEvent.setup();
       render(<ProgressHarness players={PLAYERS} numQuestions={3} />);
   
       await user.click(screen.getByRole('button', { name: 'opponent-advances' }));
       await user.click(screen.getByRole('button', { name: 'opponent-overruns' }));
   
       expect(screen.getByTestId('opponentCurrent')).toHaveTextContent('1');
       expect(screen.getByTestId('life')).toHaveTextContent('100,40');
     });
   
     it('ignores progress for a player who is not in the match', async () => {
       const user = userEvent.setup();
       render(<ProgressHarness players={PLAYERS} numQuestions={3} />);
   
       await user.click(screen.getByRole('button', { name: 'unknown-player' }));
   
       expect(screen.getByTestId('opponentCurrent')).toHaveTextContent('0');
       expect(screen.getByTestId('life')).toHaveTextContent('100,100');
     });

     it('marks the opponent as done', async () => {
         const user = userEvent.setup();
         render(<ProgressHarness players={PLAYERS} numQuestions={3} />);
     
         await user.click(screen.getByRole('button', { name: 'opponent-done' }));
     
         expect(screen.getByTestId('opponentDone')).toHaveTextContent('true');
       });
     
       it('updates a known player life and ignores an unknown one', async () => {
         const user = userEvent.setup();
         render(<ProgressHarness players={PLAYERS} numQuestions={3} />);
     
         await user.click(screen.getByRole('button', { name: 'hurt-me' }));
         expect(screen.getByTestId('life')).toHaveTextContent('60,100');
     
         await user.click(screen.getByRole('button', { name: 'hurt-ghost' }));
         expect(screen.getByTestId('life')).toHaveTextContent('60,100');
       });
     });
     
     const TimerHarness = ({ duration, onExpire }: { duration: number; onExpire: () => void }) => {
       const timer = useGameTimer(duration, onExpire);
       return (
         <div>
           <span data-testid="running">{String(timer.isRunning)}</span>
           <span data-testid="minutes">{timer.minutes}</span>
         </div>
       );
     };
  
     describe('useGameTimer integration', () => {
       beforeEach(() => {
         vi.useFakeTimers({ shouldAdvanceTime: true });
       });
     
       afterEach(() => {
         vi.useRealTimers();
       });
     
       it('stays stopped while there is no duration yet', () => {
         render(<TimerHarness duration={0} onExpire={vi.fn()} />);
     
         expect(screen.getByTestId('running')).toHaveTextContent('false');
       });
     
       it('starts counting down once a duration arrives', () => {
         const { rerender } = render(<TimerHarness duration={0} onExpire={vi.fn()} />);
     
         rerender(<TimerHarness duration={2} onExpire={vi.fn()} />);
     
         expect(screen.getByTestId('running')).toHaveTextContent('true');
         expect(Number(screen.getByTestId('minutes').textContent)).toBeGreaterThan(0);
       });
     
       it('calls onExpire when the clock runs out', async () => {
         const onExpire = vi.fn();
         render(<TimerHarness duration={1} onExpire={onExpire} />);
     
         await act(async () => {
           await vi.advanceTimersByTimeAsync(61_000);
         });
     
         expect(onExpire).toHaveBeenCalled();
         expect(screen.getByTestId('running')).toHaveTextContent('false');
       });
     });

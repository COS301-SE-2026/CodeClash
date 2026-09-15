import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMatchmaking } from 'src/context/Socket/hooks/useMatchmaking';
import { MatchmakingProvider } from 'src/context/Socket/MatchmakingContext';
import { SocketContext } from 'src/context/Socket/SocketContextValue';
import type { MatchedUsersDTO } from 'src/dtos/matched-user.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FakeSocket } from './helpers';

const MATCHED: MatchedUsersDTO = {
  players: {
    player_1: { id: 'user-1', elo: 1400, username: 'ntu' },
    player_2: { id: 'user-2', elo: 1390, username: 'rival' },
  },
  pair_id: 'pair-42',
  game_mode: 'programming',
};

const MatchmakingConsumer = ({ socket }: { socket: FakeSocket }) => {
  const mm = useMatchmaking();

  return (
    <div>
      <span data-testid="matched">{String(mm.matched)}</span>
      <span data-testid="pairId">{mm.pairId || 'none'}</span>
      <span data-testid="mode">{mm.gameMode ?? 'none'}</span>
      <span data-testid="type">{mm.gameType ?? 'none'}</span>
      <span data-testid="opponent">{mm.matchedUsers?.players.player_2.username ?? 'none'}</span>
      <button onClick={() => mm.setGameMode('math')}>set-mode</button>
      <button onClick={() => mm.setGameType('ranked')}>set-type</button>
      <button onClick={() => mm.setMatched(false)}>reset-matched</button>
      <button
        onClick={() =>
          mm.joinMatchQueue(socket.asSocket(), {
            elo: 1400,
            game_mode: 'programming',
            game_type: 'ranked',
            username: 'ntu',
          })
        }
      >
        join
      </button>
      <button onClick={() => mm.leaveMatchQueue(socket.asSocket())}>leave</button>
      <button
        onClick={() =>
          mm.matchAccepted(socket.asSocket(), {
            pair_id: 'pair-42',
            game_mode: 'programming',
            league: 'Gold',
            username: 'ntu',
            avatar: 'robot.png',
            game_type: 'ranked',
          })
        }
      >
        accept
      </button>
      <button onClick={() => mm.matchDeclined(socket.asSocket(), 'pair-42')}>decline</button>
    </div>
  );
};

const renderMatchmaking = (socket: FakeSocket | null) =>
  render(
    <SocketContext.Provider value={{ socket: socket ? socket.asSocket() : null, isConnected: !!socket }}>
      <MatchmakingProvider>
        <MatchmakingConsumer socket={socket ?? new FakeSocket()} />
      </MatchmakingProvider>
    </SocketContext.Provider>,
  );

describe('MatchmakingProvider integration', () => {
  let socket: FakeSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    socket = new FakeSocket();
    
  });

  it('starts with an empty matchmaking state', () => {
      renderMatchmaking(socket);
  
      expect(screen.getByTestId('matched')).toHaveTextContent('false');
      expect(screen.getByTestId('pairId')).toHaveTextContent('none');
      expect(screen.getByTestId('mode')).toHaveTextContent('none');
      expect(screen.getByTestId('type')).toHaveTextContent('none');
      expect(screen.getByTestId('opponent')).toHaveTextContent('none');
    });
  
    it('subscribes to users_matched as soon as a socket exists', () => {
      renderMatchmaking(socket);
  
      expect(socket.on).toHaveBeenCalledWith('users_matched', expect.any(Function));
    });
  
    it('does not subscribe when there is no socket yet', () => {
      renderMatchmaking(null);
  
      expect(screen.getByTestId('matched')).toHaveTextContent('false');
    });
  
    it('stores the pair and both players when the server matches users', () => {
      renderMatchmaking(socket);
  
      act(() => socket.server('users_matched', MATCHED));
  
      expect(screen.getByTestId('matched')).toHaveTextContent('true');
      expect(screen.getByTestId('pairId')).toHaveTextContent('pair-42');
      expect(screen.getByTestId('opponent')).toHaveTextContent('rival');
    });

  
});
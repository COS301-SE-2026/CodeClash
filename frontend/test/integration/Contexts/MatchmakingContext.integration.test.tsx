import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useMatchmaking } from '../../../src/context/Matchmaking/hooks/useMatchmaking';
import { MatchmakingProvider } from '../../../src/context/Matchmaking/MatchmakingContext';
import { SocketContext } from '../../../src/context/Socket/SocketContextValue';
import type { MatchedUsersDTO } from '../../../src/dtos/matchmaking/matched-user.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchmakingSocket } from 'src/context/Socket/modules/matchmaking.socket';

import { FakeSocket } from '../helpers';

const MATCHED: MatchedUsersDTO = {
  players: [ { id: 'user-1', elo: 1400, username: 'ntu' },
     { id: 'user-2', elo: 1390, username: 'rival' },
  ],
  group_id: 'pair-42',
  match_mode: 'programming',
};

const MatchmakingConsumer = () => {
  const mm = useMatchmaking();

  return (
    <div>
      <span data-testid="matched">{String(mm.matched)}</span>
      <span data-testid="group_id">{mm.group_id || 'none'}</span>
      <span data-testid="mode">{mm.match_mode ?? 'none'}</span>
      <span data-testid="type">{mm.gameType ?? 'none'}</span>
      <span data-testid="opponent">{mm.matchedUsers?.players[1].username ?? 'none'}</span>
      <button onClick={() => mm.set_match_mode('math')}>set-mode</button>
      <button onClick={() => mm.setGameType('ranked')}>set-type</button>
      <button onClick={() => mm.setMatched(false)}>reset-matched</button>
       </div>
  );
};

const renderMatchmaking = (socket: FakeSocket | null) =>
  render(
    <SocketContext.Provider value={{ matchmaking_socket: socket ? new MatchmakingSocket(socket.asSocket()) : null, isConnected: !!socket , match_socket: null}}>
      <MatchmakingProvider>
        <MatchmakingConsumer />
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
      expect(screen.getByTestId('group_id')).toHaveTextContent('none');
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
      expect(screen.getByTestId('group_id')).toHaveTextContent('pair-42');
      expect(screen.getByTestId('opponent')).toHaveTextContent('rival');
    });

    it('lets a consumer clear the matched flag after a decline', async () => {
        const user = userEvent.setup();
        renderMatchmaking(socket);
        act(() => socket.server('users_matched', MATCHED));
    
        await user.click(screen.getByRole('button', { name: 'reset-matched' }));
    
        expect(screen.getByTestId('matched')).toHaveTextContent('false');
        expect(screen.getByTestId('group_id')).toHaveTextContent('pair-42');
      });
    
      it('records the chosen game mode and type', async () => {
        const user = userEvent.setup();
        renderMatchmaking(socket);
    
        await user.click(screen.getByRole('button', { name: 'set-mode' }));
        await user.click(screen.getByRole('button', { name: 'set-type' }));
    
        expect(screen.getByTestId('mode')).toHaveTextContent('math');
        expect(screen.getByTestId('type')).toHaveTextContent('ranked');
      });
    
      it('emits the queue join payload', async () => {
        const user = userEvent.setup();
        renderMatchmaking(socket);
    
        await user.click(screen.getByRole('button', { name: 'join' }));
    
        expect(socket.emitsOf('join_match_queue')).toEqual([
          [{ elo: 1400, game_mode: 'programming', game_type: 'ranked', username: 'ntu' }],
        ]);
      });

      it('emits leave, accept and decline on the shared socket', async () => {
          const user = userEvent.setup();
          renderMatchmaking(socket);
      
          await user.click(screen.getByRole('button', { name: 'leave' }));
          await user.click(screen.getByRole('button', { name: 'accept' }));
          await user.click(screen.getByRole('button', { name: 'decline' }));
      
          expect(socket.emitsOf('leave_match_queue')).toEqual([[]]);
          expect(socket.emitsOf('match_accepted')[0][0]).toMatchObject({ pair_id: 'pair-42', league: 'Gold' });
          expect(socket.emitsOf('match_declined')).toEqual([['pair-42']]);
        });
      
        it('throws when useMatchmaking is called outside the provider', () => {
          const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
          expect(() =>
            render(
              <SocketContext.Provider value={{ matchmaking_socket: null, isConnected: false, match_socket: null }}>
                <MatchmakingConsumer />
              </SocketContext.Provider>,
            ),
          ).toThrow('useMatchmaking must be used within a Matchmaking Provider');
          quiet.mockRestore();
        });

  
});
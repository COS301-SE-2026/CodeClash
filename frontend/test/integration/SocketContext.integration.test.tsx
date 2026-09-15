import { render, screen, waitFor, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FakeSocket } from './helpers';

const ws = vi.hoisted(() => ({ createSocket: vi.fn() }));
vi.mock('src/services/websocket.service', () => ws);

import { SocketProvider } from 'src/context/Socket/SocketContext';
import { useSocket } from 'src/context/Socket/hooks/useSocket';

const SocketConsumer = () => {
  const { socket, isConnected } = useSocket();

  return (
    <div>
      <span data-testid="connected">{String(isConnected)}</span>
      <span data-testid="socket">{socket ? 'ready' : 'none'}</span>
    </div>
  );
};

const renderSocket = () =>
  render(
    <SocketProvider>
      <SocketConsumer />
    </SocketProvider>,
  );

describe('SocketProvider integration', () => {
  let socket: FakeSocket
  
  beforeEach(() => {
    vi.clearAllMocks();
    socket = new FakeSocket();
    ws.createSocket.mockResolvedValue(socket.asSocket());
  });

  it('publishes the socket once the connection factory resolves', async () => {
      renderSocket();
  
      expect(screen.getByTestId('socket')).toHaveTextContent('none');
      await waitFor(() => expect(screen.getByTestId('socket')).toHaveTextContent('ready'));
      expect(ws.createSocket).toHaveBeenCalledTimes(1);
    });

  it('tracks the connect and disconnect lifecycle', async () => {
      renderSocket();
      await waitFor(() => expect(screen.getByTestId('socket')).toHaveTextContent('ready'));
  
      expect(screen.getByTestId('connected')).toHaveTextContent('false');
  
      act(() => socket.server('connect'));
      expect(screen.getByTestId('connected')).toHaveTextContent('true');
  
      act(() => socket.server('disconnect'));
      expect(screen.getByTestId('connected')).toHaveTextContent('false');
    });
  
    it('registers exactly one connect and one disconnect listener', async () => {
      renderSocket();
      await waitFor(() => expect(screen.getByTestId('socket')).toHaveTextContent('ready'));
  
      expect(socket.handlers.get('connect')).toHaveLength(1);
      expect(socket.handlers.get('disconnect')).toHaveLength(1);
    });


});
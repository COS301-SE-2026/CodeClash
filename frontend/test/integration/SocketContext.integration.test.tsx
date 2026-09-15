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
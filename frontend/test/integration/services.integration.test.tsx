import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FakeSocket } from './helpers';

const amplify = vi.hoisted(() => ({ fetchAuthSession: vi.fn() }));
vi.mock('aws-amplify/auth', () => amplify);

const socketio = vi.hoisted(() => ({ io: vi.fn(), Socket: class {} }));
vi.mock('socket.io-client', () => socketio);

import { createSocket } from 'src/services/websocket.service';
import { submitAnswer } from 'src/services/submission.service';
import { endGame } from 'src/services/result.service';
import { API } from 'src/services/api.service';

const PROG_SUBMISSION = { source_code: 'print(1)', language_id: 71, stdin: null };
const MATH_SUBMISSION = { answer: '42' };

describe('websocket.service integration', () => {
  let socket: FakeSocket;

  beforeEach(() => {
    vi.clearAllMocks();
    socket = new FakeSocket();
    socketio.io.mockReturnValue(socket.asSocket());
    amplify.fetchAuthSession.mockResolvedValue({ tokens: { idToken: { toString: () => 'id-token-abc' } } });
  });

  it('forces a token refresh and hands the id token to socket.io', async () => {
    const conn = await createSocket();

    expect(amplify.fetchAuthSession).toHaveBeenCalledWith({ forceRefresh: true });
    expect(socketio.io).toHaveBeenCalledWith(import.meta.env.VITE_WEBSOCKET_URL, {
      auth: { token: 'id-token-abc' },
    });
    expect(conn).toBe(socket);
  });

  it('still connects with an undefined token when the session has none', async () => {
    amplify.fetchAuthSession.mockResolvedValue({ tokens: undefined });

    await createSocket();

    expect(socketio.io).toHaveBeenCalledWith(import.meta.env.VITE_WEBSOCKET_URL, {
      auth: { token: undefined },
    });
  });

  it('logs connection errors reported by the socket', async () => {
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});

    await createSocket();
    socket.server('connect_error', new Error('handshake rejected'));

    expect(quiet).toHaveBeenCalledWith('Error connecting to socket: Error: handshake rejected');
    quiet.mockRestore();
  });

  it('propagates a failure to fetch the session', async () => {
    amplify.fetchAuthSession.mockRejectedValue(new Error('no session'));

    await expect(createSocket()).rejects.toThrow('no session');
    expect(socketio.io).not.toHaveBeenCalled();
  });
});

describe('submission.service integration', () => {
  let socket: FakeSocket;

  beforeEach(() => {
    socket = new FakeSocket();
  });

  it('wraps a programming submission in the game envelope', () => {
    submitAnswer(socket.asSocket(), 12, 'q-1', 0, 'prog', PROG_SUBMISSION);

    expect(socket.emitsOf('submit_prog_question')).toEqual([
      [{ match_id: 12, question_id: 'q-1', question_number: 0, submission: PROG_SUBMISSION }],
    ]);
  });
});
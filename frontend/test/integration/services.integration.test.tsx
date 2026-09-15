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

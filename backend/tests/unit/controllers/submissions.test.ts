import { Request, Response } from 'express';
import { vi, Mocked, describe, it, expect, afterEach } from 'vitest'
import pool from '../../../src/frameworks-drivers/config/db';

vi.mock('../../src/config/db', () => ({
  default: {
    query: vi.fn(),
    connect: vi.fn(),
  }
}));
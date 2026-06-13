import { vi, Mocked, describe, it, expect, afterEach } from 'vitest'

import { Request, Response } from 'express';
import {
  getMatches,
  getMatchById,
  createMatch,
  updateMatchStatus,
  getMatchLog,
  createMatchLog,
} from '../../src/controllers/matches.controllers';
import pool from '../../src/config/db';

vi.mock('../../src/config/db', () => ({
  default: {
    query: vi.fn(),
  }
}));

const mockPool = pool as Mocked<typeof pool>;

const mockReq = (overrides: Partial<Request> = {}): Request =>
({
  params: {},
  body: {},
  query: {},
  ...overrides,
} as unknown as Request);

const mockRes = (): Response => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

// ─── getMatches ────────

describe('getMatches', () => {
  afterEach(() => vi.clearAllMocks());

  it('returns 200 with match rows when no filters provided', async () => {
    const rows = [
      { match_id: 'uuid-1', mode: 'ranked', status: 'completed', queue_start: new Date(), match_start: new Date() },
      { match_id: 'uuid-2', mode: 'casual', status: 'waiting', queue_start: new Date(), match_start: null },
    ];
    mockPool.query.mockResolvedValueOnce({ rows } as any);

    const req = mockReq({ query: {} });
    const res = mockRes();
    await getMatches(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(rows);
  });

  it('applies status filter when provided', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

    const req = mockReq({ query: { status: 'completed' } });
    const res = mockRes();
    await getMatches(req, res);

    const [sql, params] = mockPool.query.mock.calls[0];
    expect(sql).toContain('status = $1');
    expect(params).toContain('completed');
  });

  it('applies mode filter when provided', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

    const req = mockReq({ query: { mode: 'ranked' } });
    const res = mockRes();
    await getMatches(req, res);

    const [sql, params] = mockPool.query.mock.calls[0];
    expect(sql).toContain('mode = $1');
    expect(params).toContain('ranked');
  });

  it('applies both filters when provided', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

    const req = mockReq({ query: { status: 'in_progress', mode: 'casual' } });
    const res = mockRes();
    await getMatches(req, res);

    const [sql, params] = mockPool.query.mock.calls[0];
    expect(sql).toContain('status = $1');
    expect(sql).toContain('mode = $2');
    expect(params).toContain('in_progress');
    expect(params).toContain('casual');
  });

  it('applies default limit and offset when not provided', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

    const req = mockReq({ query: {} });
    const res = mockRes();
    await getMatches(req, res);

    const [, params] = mockPool.query.mock.calls[0];
    expect(params).toContain(10);  // default limit
    expect(params).toContain(0);   // default offset
  });

  it('returns 500 on database error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockReq({ query: {} });
    const res = mockRes();
    await getMatches(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

// ─── getMatchById ──────

describe('getMatchById', () => {
  afterEach(() => vi.clearAllMocks());

  it('returns 200 with match data when match exists', async () => {
    const row = { match_id: 'uuid-1', mode: 'ranked', status: 'completed' };
    mockPool.query.mockResolvedValueOnce({ rows: [row] } as any);

    const req = mockReq({ params: { match_id: 'uuid-1' } });
    const res = mockRes();
    await getMatchById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(row);
  });

  it('returns 404 when match does not exist', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

    const req = mockReq({ params: { match_id: 'nonexistent' } });
    const res = mockRes();
    await getMatchById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Match not found' });
  });

  it('passes match_id as query parameter', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{}] } as any);

    const req = mockReq({ params: { match_id: 'uuid-123' } });
    const res = mockRes();
    await getMatchById(req, res);

    const [, params] = mockPool.query.mock.calls[0];
    expect(params).toEqual(['uuid-123']);
  });

  it('returns 500 on database error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockReq({ params: { match_id: 'uuid-1' } });
    const res = mockRes();
    await getMatchById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

// ─── createMatch ───────

describe('createMatch', () => {
  afterEach(() => vi.clearAllMocks());

  it('returns 201 with created match on success', async () => {
    const row = {
      match_id: 'uuid-new',
      player1_id: 'p1',
      player2_id: 'p2',
      mode: 'ranked',
      match_problems_id: 'mp-1',
    };
    mockPool.query.mockResolvedValueOnce({ rows: [row] } as any);

    const req = mockReq({
      body: { player1_id: 'p1', player2_id: 'p2', mode: 'ranked', match_problems_id: 'mp-1' },
    });
    const res = mockRes();
    await createMatch(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(row);
  });

  it('inserts all required fields into the query', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{}] } as any);

    const req = mockReq({
      body: { player1_id: 'p1', player2_id: 'p2', mode: 'casual', match_problems_id: 'mp-2' },
    });
    const res = mockRes();
    await createMatch(req, res);

    const [, params] = mockPool.query.mock.calls[0];
    expect(params).toEqual(['p1', 'p2', 'casual', 'mp-2']);
  });

  it('returns 500 on database error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockReq({
      body: { player1_id: 'p1', player2_id: 'p2', mode: 'ranked', match_problems_id: 'mp-1' },
    });
    const res = mockRes();
    await createMatch(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

// ─── updateMatchStatus ─

describe('updateMatchStatus', () => {
  afterEach(() => vi.clearAllMocks());

  it('returns 200 with updated match on success', async () => {
    const row = { match_id: 'uuid-1', status: 'in_progress', match_start: new Date() };
    mockPool.query.mockResolvedValueOnce({ rows: [row] } as any);

    const req = mockReq({ params: { match_id: 'uuid-1' }, body: { status: 'in_progress' } });
    const res = mockRes();
    await updateMatchStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(row);
  });

  it('sets match_start when status is "starting"', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{}] } as any);

    const req = mockReq({ params: { match_id: 'uuid-1' }, body: { status: 'starting' } });
    const res = mockRes();
    await updateMatchStatus(req, res);

    const [sql] = mockPool.query.mock.calls[0];
    expect(sql).toContain("WHEN $1 = 'starting' THEN NOW()");
  });

  it('returns 404 when match does not exist', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

    const req = mockReq({ params: { match_id: 'nonexistent' }, body: { status: 'completed' } });
    const res = mockRes();
    await updateMatchStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Match not found' });
  });

  it('returns 500 on database error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockReq({ params: { match_id: 'uuid-1' }, body: { status: 'abandoned' } });
    const res = mockRes();
    await updateMatchStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

// ─── getMatchLog ───────

describe('getMatchLog', () => {
  afterEach(() => vi.clearAllMocks());

  it('returns 200 with log data when log exists', async () => {
    const row = {
      log_id: 'log-1',
      match_id: 'uuid-1',
      winner_id: 'p1',
      loser_id: 'p2',
      elo_gained: 20,
      elo_lost: 20,
    };
    mockPool.query.mockResolvedValueOnce({ rows: [row] } as any);

    const req = mockReq({ params: { match_id: 'uuid-1' } });
    const res = mockRes();
    await getMatchLog(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(row);
  });

  it('returns 404 when no log found for match', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

    const req = mockReq({ params: { match_id: 'nonexistent' } });
    const res = mockRes();
    await getMatchLog(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Match log not found' });
  });

  it('returns 500 on database error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockReq({ params: { match_id: 'uuid-1' } });
    const res = mockRes();
    await getMatchLog(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

// ─── createMatchLog ────

describe('createMatchLog', () => {
  afterEach(() => vi.clearAllMocks());

  it('returns 201 with created log on success', async () => {
    const row = { log_id: 'log-new', match_id: 'uuid-1', winner_id: 'p1', loser_id: 'p2' };
    mockPool.query.mockResolvedValueOnce({ rows: [row] } as any);

    const req = mockReq({ body: { match_id: 'uuid-1', winner_id: 'p1', loser_id: 'p2' } });
    const res = mockRes();
    await createMatchLog(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(row);
  });

  it('inserts match_id, winner_id and loser_id into the query', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{}] } as any);

    const req = mockReq({ body: { match_id: 'uuid-1', winner_id: 'p1', loser_id: 'p2' } });
    const res = mockRes();
    await createMatchLog(req, res);

    const [, params] = mockPool.query.mock.calls[0];
    expect(params).toEqual(['uuid-1', 'p1', 'p2']);
  });

  it('does not insert elo values for casual match log', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{}] } as any);

    const req = mockReq({ body: { match_id: 'uuid-1', winner_id: 'p1', loser_id: 'p2' } });
    const res = mockRes();
    await createMatchLog(req, res);

    const [sql] = mockPool.query.mock.calls[0];
    expect(sql).not.toContain('elo_gained');
    expect(sql).not.toContain('elo_lost');
  });

  it('returns 500 on database error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('DB error'));

    const req = mockReq({ body: { match_id: 'uuid-1', winner_id: 'p1', loser_id: 'p2' } });
    const res = mockRes();
    await createMatchLog(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
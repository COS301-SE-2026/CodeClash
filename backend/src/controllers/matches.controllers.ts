import { Request, Response } from 'express';
import pool from '../config/db';

//GET api/matches/:optional params
//Returns a paginated list of matches for the authenticated user. Optionally filter by status or game mode.
export const getMatches = async (req: Request, res: Response): Promise<void> => {
    const { status, mode, limit = '10', offset = '0' } = req.query;
    

    try{
        const conditions: string[] = [];
        const values: any[] = [];

        if (status) {
            conditions.push(`status = $${values.length + 1}`);
            values.push(status);
        }
        if (mode) {
            conditions.push(`mode = $${values.length + 1}`);
            values.push(mode);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const result = await pool.query(
      `SELECT 
        match_id,
        mode,
        status,
        queue_start, 
        match_start
        FROM matches
        ${where}
        LIMIT $${values.length +1} OFFSET $${values.length + 2}`,
        [...values, parseInt(limit as string), parseInt(offset as string)]
        );

        res.status(200).json(result.rows[0]);
    } catch(error){
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET api/matches/{match_id}
//Fetches a single match with its problems and players
export const getMatchById = async (req: Request, res: Response): Promise<void> => {
    const { match_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                m.match_id, m.mode, m.status, m.queue_start, m.match_start,
                m.player1_id, m.player2_id, m.match_problems_id
             FROM matches m
             WHERE m.match_id = $1`,
            [match_id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Match not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching match:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//POST 
//Creates a match when two people are connected in the queue
export const createMatch = async (req: Request, res: Response): Promise<void> => {
    const { player1_id, player2_id, mode, match_problems_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO matches (player1_id, player2_id, mode, match_problems_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [player1_id, player2_id, mode, match_problems_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//POST
//Updates the status of a match, sets match_start at the beginning of a match
//N.B this endpoint MUST be called at the starting of a match
export const updateMatchStatus = async (req: Request, res: Response): Promise<void> => {
    const { match_id } = req.params;
    const { status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE matches
             SET 
                status = $1,
                match_start = CASE WHEN $1 = 'starting' THEN NOW() ELSE match_start END
             WHERE match_id = $2
             RETURNING *`,
            [status, match_id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Match not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET api/matches/:{match_id}/log
//Returns the history of a completed match
export const getMatchLog = async (req: Request, res: Response): Promise<void> => {
    const { match_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                ml.log_id, ml.match_id,
                ml.winner_id, ml.loser_id,
                ml.elo_gained, ml.elo_lost
             FROM match_log ml
             WHERE ml.match_id = $1`,
            [match_id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Match log not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching match log:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//POST
//Creates a match log for a casual match as there is no elo update
export const createMatchLog = async (req: Request, res: Response): Promise<void> => {
    const { match_id, winner_id, loser_id } = req.body;

    try {
        // Insert match log
        const logResult = await pool.query(
            `INSERT INTO match_log (match_id, winner_id, loser_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [match_id, winner_id, loser_id]
        );


        res.status(201).json(logResult.rows[0]);
    } catch (error) {
        console.error('Error creating match log:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
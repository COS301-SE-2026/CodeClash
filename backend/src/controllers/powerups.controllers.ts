import { Request, Response } from 'express';
import pool from '../config/db';

//GET /powerups
// Get all available powerups
export const getPowerups = async (req: Request, res: Response): Promise<void> => {

    try {
        const result = await pool.query(
            `SELECT 
                powerup_id,
                type,
                description
            FROM powerups`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching powerups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET powerups/:match_id
//Get all powerups used in a match
export const getMatchPowerups = async (req: Request, res: Response): Promise<void> => {
    const { match_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                mp.match_powerup_id,
                mp.used_at,
                mp.user_id,
                u.username,
                p.type,
                p.description
            FROM match_powerups mp
            JOIN powerups p ON p.powerup_id = mp.powerup_id
            JOIN users u ON U.user_id = mp.user_id
            WHERE mp.match_id = $1
            ORDER BY mp.used_at ASC`,
            [match_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching match powerups:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Record a powerup being used in a match
export const ... = async (req: Request, res: Response): Promise<void> => {
    const { ... } = req.params;

    try {
        const result = await pool.query(
            
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error ...:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all achievements
export const ... = async (req: Request, res: Response): Promise<void> => {
    const { ... } = req.params;

    try {
        const result = await pool.query(
            
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error ...:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Get all achievements earned by a user
export const ... = async (req: Request, res: Response): Promise<void> => {
    const { ... } = req.params;

    try {
        const result = await pool.query(
            
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error ...:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//Award an achievement
export const ... = async (req: Request, res: Response): Promise<void> => {
    const { ... } = req.params;

    try {
        const result = await pool.query(
            
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error ...:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
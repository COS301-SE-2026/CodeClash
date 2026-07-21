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

//GET powerups/match/:match_id
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
            JOIN users u ON u.user_id = mp.user_id
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

//POST powerups/use
//Record a powerup being used in a match
export const usePowerup = async (req: Request, res: Response): Promise<void> => {
    const { match_id, user_id, powerup_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO match_powerups (match_id, user_id, powerup_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [match_id, user_id, powerup_id]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error adding used powerup to database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET /achievements
// Get all achievements
export const getAchievements = async (req: Request, res: Response): Promise<void> => {

    try {
        const result = await pool.query(
            `SELECT
                achievement_id,
                achievement_name,
                description
            FROM achievements
                `
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET achievements/user/:user_id
//Get all achievements earned by a user
export const getUserAchievements = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                u.username,
                a.achievement_id,
                a.achievement_name,
                a.description
            FROM achievements a
            JOIN player_achievments pa ON pa.achievement_id = a.achievement_id
            WHERE pa.user_id = $1`,
            [user_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching user achievements:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//POST achievements/award
//Award an achievement
export const awardAchievement = async (req: Request, res: Response): Promise<void> => {
    const { user_id, achievement_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO player_achievements (user_id, achievement_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, achievement_id) DO NOTHING
            RETURNING *`,
            [user_id, achievement_id]
        );

        if(result.rows.length === 0){
            res.status(409).json({message: 'User already has this achievement'});
            return;
        }
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error awarding achievement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
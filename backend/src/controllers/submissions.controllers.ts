/*
    All the endpoints that have to do with match game submissions.
    - Documented with Swagger Docs
*/

import { Request, Response } from 'express';
import pool from '../config/db';

//POST
export const createSubmission = async (req: Request, res: Response): Promise<void> => {
    //entry will either be code or maths text
    const { user_id, match_id, problem_id, entry } = req.body;
    const { type } = req.query;

    try {
        const query = type === 'math'
        ? `INSERT INTO submissions (user_id, match_id, problem_id, answer)
            VALUES ($1, $2, $3, $4)
            RETURNING *`
        : `INSERT INTO submissions (user_id, match_id, problem_id, code)
            VALUES ($1, $2, $3, $4)
            RETURNING *`

        const result = await pool.query(query,[user_id,match_id, problem_id, entry]);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error entering submission into database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createExecutionResult = async (req: Request, res: Response): Promise<void> => {
    const { submission_id, passed_cases, total_cases, execution_time, memory_used, error_message = null } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO execution_results (submission_id, passed_cases, total_cases, execution_time, memory_used, error_message)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [submission_id, passed_cases, total_cases, execution_time, memory_used, error_message]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error entering the execution result to the database', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//PATCH
export const updateSubmissionStatus = async (req: Request, res: Response): Promise<void> => {
    const { status, submission_id } = req.body;

    try {
        const result = await pool.query(
            `UPDATE submissions
            SET status = $1
            WHERE submission_id = $2
            RETURNING *`,
            [status, submission_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error updating the status of the submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET
export const getSubmissionsByMatch = async (req: Request, res: Response): Promise<void> => {
    const { match_id } = req.params;

    try {
        const result = await pool.query(
            
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error ...:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSubmissionsByUser = async (req: Request, res: Response): Promise<void> => {
    const { .... } = req.params;

    try {
        const result = await pool.query(
            
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error ...:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSubmissionById = async (req: Request, res: Response): Promise<void> => {
    const { .... } = req.params;

    try {
        const result = await pool.query(
            
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error ...:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
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
        ? `INSERT INTO submissions (user_id, match_id, problem_id, submission_type, answer)
            VALUES ($1, $2, $3, $4)
            RETURNING *`
        : `INSERT INTO submissions (user_id, match_id, problem_id, code)
            VALUES ($1, $2, $3, $4)
            RETURNING *`

        const result = await pool.query(query,[user_id,match_id, problem_id, entry]);

        res.status(201).json(result.rows[0]);

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

//GET submissions/
//Left Joins so that submissions without execution results still appear
export const getSubmissionsByMatch = async (req: Request, res: Response): Promise<void> => {
    const { match_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                s.submission_id,
                s.user_id,
                s.problem_id,
                s.submission_type,
                s.code,
                s.language,
                s.answer,
                s.status,
                s.submitted_at,
                er.passed_cases,
                er.total_cases,
                er.execution_time,
                er.memory_used,
                er.error_message
            FROM submissions s
            LEFT JOIN execution_results er ON er.submission_id = s.submission_id
            WHERE s.match_id = $1
            ORDER BY s.submitted_at ASC`,
            [match_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching submissions for match:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET 
export const getSubmissionsByUser = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                s.submission_id,
                s.match_id,
                s.problem_id,
                s.submission_type,
                s.status,
                s.submitted_at
            FROM submissions s
            WHERE s.user_id = $1
            ORDER BY s.submitted_at DESC`,
            [user_id]
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching submission for user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET
export const getSubmissionById = async (req: Request, res: Response): Promise<void> => {
    const { submission_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT
                s.submission_id,
                s.user_id,
                s.match_id,
                s.problem_id,
                s.submission_type,
                s.code,
                s.language,
                s.answer,
                s.status,
                s.submitted_at,
                er.passed_cases,
                er.total_cases,
                er.execution_time,
                er.memory_used,
                er.error_message
            FROM submissions s
            LEFT JOIN execution_results er ON er.submission_id = s.submission_id
            WHERE s.submission_id = $1`,
            [submission_id]
        );

        if(result.rows.length === 0){
            res.status(404).json({message: 'Submission not found'});
            return;
        }
        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
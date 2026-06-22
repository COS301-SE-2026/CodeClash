/*
    All the endpoints that have to do with friend interactions in the game and the database.
    - Documented with Swagger Docs
*/

import { Request, Response } from 'express';
import pool from '../config/db';

//Returns the friends of a specific user
export const getFriendsById = async (req: Request, res: Response): Promise<void> => {
    const { friendship_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                f.receiver_id, u.username, f.status, f.created_at, f.updated_at
             FROM friendships f
             JOIN users u ON f.receiver_id = u.user_id
             WHERE f.status = 'Accepted' AND f.sender_id = $1`,
            [friendship_id]
        );

        //A user can have no friends...
        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching friends list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


//Returns the requests a user has sent/received
export const getFriendRequests = async (req: Request, res: Response): Promise<void> => {
    const {user_id} = req.params;
    const { type = 'received' } = req.query; //defaults to received

    try{
        const query = type === 'sent' 
        ? `SELECT 
            f.frinedship_id,
            f.status,
            f.created_at,
            u.user_id,
            u.username
            FROM friendships f
            JOIN users u ON u.user_id = f.receiver_id
            WHERE f.requester_id = $1 AND f.status = 'pending'`
        : `SELECT
            f.friendship_id,
            f.status,
            f.created_at,
            u.user_id,
            u.username
            FROM friendships f
            JOIN users u ON u.user_id = f.requester_id
            WHERE f.receiver_id = $1 AND f.status = 'pending'`

            const result = await pool.query(query, [user_id]);

            res.status(200).json(result.rows);
    }catch(error){
        console.error('Error fetching friend requests:', error);
        res.status(500).json({message:'Internal Server Error'});
    }

};
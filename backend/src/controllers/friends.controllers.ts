/*
    All the endpoints that have to do with friend interactions in the game and the database.
    - Documented with Swagger Docs
*/

import { Request, Response } from 'express';
import pool from '../config/db';

//GET api/friends/{user_id}
//Returns the friends of a specific user
export const getFriendsById = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                u.user_id, u.username, f.created_at, f.updated_at
             FROM friendships f
             JOIN users u ON u.user_id = f.receiver_id
             WHERE f.status = 'accepted' AND f.requester_id = $1
             UNION
             SELECT
                u.user_id, u.username, f.created_at, f.updated_at
            FROM friendships f
            JOIN users u ON u.user_id = f.receiver_id
             WHERE f.status = 'accepted' AND f.receiver_id = $1`,
            [user_id]
        );

        //A user can have no friends...
        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching friends list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//GET /api/friends/requests?type=sent|received
//Returns the requests a user has sent/received
export const getFriendRequests = async (req: Request, res: Response): Promise<void> => {
    const {user_id} = req.params;
    const { type = 'received' } = req.query; //defaults to received

    try{
        const query = type === 'sent' 
        ? `SELECT 
            f.friendship_id,
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

//POST 
//Adds the play invite request to the database
export const addFriendInvite = async (req: Request, res: Response): Promise<void> => {
    const { sender_id, invite_code, expires_at } = req.body;

    try{
        const result = await pool.query(
            `INSERT INTO friend_invites (sender_id, invite_code, expires_at)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [sender_id, invite_code, expires_at]
        );
        
        res.status(201).json(result.rows[0]);
    }catch (error){
        console.error('Error creating play invite:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//POST 
//Creates a pending friendship
export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
    const { requester_id, receiver_id} = req.body;

    try{
        const result = await pool.query(
            `INSERT INTO friendships (requester_id, receiver_id)
            VALUES ($1, $2)
            RETURNING *`,
            [requester_id, receiver_id]
        );
        
        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//PATCH
//Accept or Reject friend request
export const respondToFriendRequest = async (req: Request, res: Response): Promise<void> => {
    const { friendship_id } = req.body;
    const { verdict } = req.params;

    try{
        const result = await pool.query(
            `UPDATE friendships 
            SET status = $1, updated_at = NOW()
            WHERE friendship_id = $2
            RETURNING *`,
            [verdict, friendship_id]
        );
        
        res.status(201).json(result.rows[0]);
    }catch(error){
        console.error('Error responding to friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//DELETE
//Deletes a friend
export const removeFriend = async (req: Request, res: Response): Promise<void> => {
    const { friendship_id } = req.params;
    

    try{
        const result = await pool.query(
            `DELETE FROM friendships 
            WHERE friendship_id = $1
            RETURNING *`,
            [friendship_id]
        );
        
        if(result.rows.length === 0){
            res.status(404).json({message: "Friendship not found"});
            return;
        }

        res.status(200).json({message: "Friendship removed sucessfully"});
    }catch(error){
        console.error('Error removing friend:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
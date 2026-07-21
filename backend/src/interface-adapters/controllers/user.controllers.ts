import { Request, Response } from 'express';
import {  validStat } from '../auth/auth.service';
import { ListUsersCommand, ListUsersCommandInput } from '@aws-sdk/client-cognito-identity-provider';


// GET /api/user/username
export const getUsername = async (req: Request, res: Response) => {

    // // Token valid proceed with request
    // const user = await fetchCognitoUser(['name'], req.user.id);

    // if (!user || user.length === 0) {
    //     res.status(404).json({ message: "User not found" })
    //     return;
    // }

    // const name = user[0]!.Attributes!.find(attr => attr.Name === 'name')?.Value;
    // res.status(200).json({ username: name });
}


/// GET api/user/:stat
export const getUserStat = async (req: Request, res: Response) => {

//     const email = req.user.email;

//     if (email === null) return;

//     const stat = req.params.stat;

//     if (typeof stat !== 'string' || !validStat(stat)) {
//         res.status(401).json({ message: 'User Stat not found' });
//         return;
//     }

//     try {
//         const result = await pool.query(
//             `SELECT ${stat} FROM users 
//             WHERE users.email = $1`,
//             [email]
//         );

//         if (result.rowCount === 0) {
//             res.status(401).json({ message: 'User Not Found' });
//             return;
//         }

//         res.status(200).json({ stat: result.rows[0] });
//     }
//     catch (error) {
//         console.error(`Error fetching ${stat}: `, error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
 }

/// GET api/user/league
export const getLeague = async (req: Request, res: Response) => {
    // const email = req.user.email;

    // if (email === null) return;

    // try {
    //     const result = await pool.query(
    //         `SELECT l.league_name FROM
    //         users u JOIN leagues l ON u.league = l.league_id
    //         WHERE u.email = $1`,
    //         [email]
    //     );

    //     if (result.rowCount === 0) {
    //         res.status(401).json({ message: 'User Not Found' });
    //         return;
    //     }

    //     res.status(200).json({ stat: result.rows[0] });
    // }
    // catch (error) {
    //     console.error(`Error fetching user league: ${error}`);
    //     res.status(500).json({ message: 'Internal server error' })
    // }

}


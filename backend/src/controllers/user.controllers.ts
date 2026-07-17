import { Request, Response } from 'express';
import { pool } from '../config/db';
import { cognito_identity_client, validStat } from '../services/auth.service';
import { ListUsersCommand, ListUsersCommandInput } from '@aws-sdk/client-cognito-identity-provider';

export async function fetchAllCognitoUsers(attributes: string[]) {
    let users = [];
    let paginationToken: string | undefined = undefined;
    let input: ListUsersCommandInput;

    const client = cognito_identity_client;

    do {
        input = {
            "AttributesToGet": attributes,
            "PaginationToken": paginationToken,
            "UserPoolId": process.env.COGNITO_USER_POOL_ID
        }

        const command = new ListUsersCommand(input);

        const response = await client.send(command);
        users.push(...response.Users || []);

        paginationToken = response.PaginationToken;
    }
    while (paginationToken !== undefined)

    return users;
}

export async function fetchCognitoUser(attributes: string[], user_id: string) {
    let input: ListUsersCommandInput;

    const client = cognito_identity_client;


    input = {
        "AttributesToGet": attributes,
        "UserPoolId": process.env.COGNITO_USER_POOL_ID,
        "Filter": `sub = "${user_id}"`
    }

    const command = new ListUsersCommand(input);

    const response = await client.send(command);
    const user = response.Users;

    return user;
}


// GET /api/user/username
export const getUsername = async (req: Request, res: Response) => {

    // Token valid proceed with request
    const user = await fetchCognitoUser(['name'], req.user.id);

    if (!user || user.length === 0) {
        res.status(404).json({ message: "User not found" })
        return;
    }

    const name = user[0]!.Attributes!.find(attr => attr.Name === 'name')?.Value;
    res.status(200).json({ username: name });
}


/// GET api/user/:stat
export const getUserStat = async (req: Request, res: Response) => {

    const email = req.user.email;

    if (email === null) return;

    const stat = req.params.stat;

    if (typeof stat !== 'string' || !validStat(stat)) {
        res.status(404).json({ message: 'User Stat not found' });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT ${stat} FROM users 
            WHERE users.email = $1`,
            [email]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'User Not Found' });
            return;
        }

        res.status(200).json({ stat: result.rows[0] });
    }
    catch (error) {
        console.error(`Error fetching ${stat}: `, error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


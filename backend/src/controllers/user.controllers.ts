import { Request, Response } from 'express';
import { pool } from '../config/db';
import { validToken, accessDenied } from '../services/auth.service';
import { ListUsersCommand, ListUsersCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import { cognito_identity_client } from '../services/auth.service';

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
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(404).json(accessDenied('Missing or Invalid Token'));
        return;
    }

    const validate = await validToken(token)

    if (!validate) {
        res.status(404).json(accessDenied('Missing or Invalid Token'));
        return;
    }

    // Token valid proceed with request
    const user = await fetchCognitoUser(['name'], validate.user_Id);

    if (!user || user.length === 0) {
        res.status(404).json({ message: "User not found" })
        return;
    }

    const name = user[0]!.Attributes!.find(attr => attr.Name === 'name')?.Value;
    res.status(200).json({ username: name });
}


// GET /api/user/current-streak

//GET /api/user/winning-streak


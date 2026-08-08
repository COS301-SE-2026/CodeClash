import { ListUsersCommand, ListUsersCommandInput, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';


export const cognito_identity_client = new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!
    }
});


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


export async function fetchAllCognitoUsers(attributes: string[]) {
    const users = [];
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
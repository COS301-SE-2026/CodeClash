
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

import dotenv from "dotenv"
dotenv.config()

const verifier = CognitoJwtVerifier.create({
  userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
  tokenUse: "id",
  clientId: `${process.env.COGNITO_CLIENT_ID}`, //client ID of app, not a userId
});


export const validToken = async (token: string) => {
  if (token === undefined)
    return null;

  const payload = await verifier.verify(token);

  return {
    user_Id: payload.sub
  };
};


export const cognito_identity_client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
});

export async function getEmail(user_id:string) {

  try {


    const client = cognito_identity_client;

    const command = new AdminGetUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: user_id
    });

    const response = await client.send(command)

    const email = response.UserAttributes?.find(attr => attr.Name === 'email')?.Value;

    return email;

  }
  catch (err) {
    console.log("get email error: ", err);
    return null;
  }
}



// Responses 

export const accessDenied = { message: "Access Denied" };
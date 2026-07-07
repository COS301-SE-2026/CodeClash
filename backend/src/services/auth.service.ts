
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


export const validToken = async (token: string | undefined) => {
  if (token === undefined)
    return null;

  try {
    const payload = await verifier.verify(token);
    return {
      user_Id: payload.sub,
      email: payload.email
    };
  }
  catch {
    return null
  }


};


export const cognito_identity_client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
});

// Responses 

export const accessDenied = (error: string) => {
  return { message: `Access Denied: ${error}` }
};

export const unauthorised = (error: string) => {
  return { message: `Unauthorised: ${error}` }
}
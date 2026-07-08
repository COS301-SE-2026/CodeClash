
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Request, Response } from 'express';

import dotenv from "dotenv"
dotenv.config()

const verifier = CognitoJwtVerifier.create({
  userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
  tokenUse: "id",
  clientId: `${process.env.COGNITO_CLIENT_ID}`, //client ID of app, not a userId
});

const STATS = new Array('current_streak', 'winning_streak');


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


export async function getEmail(req: Request, res: Response) {
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

  const email = validate.email;

  if (email === null) {
    res.status(404).json(accessDenied('User not Found'));
    return;
  }

  return email;
}

export function validStat(stat: string) {
  return STATS.includes(stat);
}

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
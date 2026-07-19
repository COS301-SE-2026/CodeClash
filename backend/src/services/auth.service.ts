
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { NextFunction, Request, Response } from 'express';

import dotenv from "dotenv"
dotenv.config()

const verifier = CognitoJwtVerifier.create({
  userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
  tokenUse: "id",
  clientId: `${process.env.COGNITO_CLIENT_ID}`, //client ID of app, not a userId
});

const STATS = new Set(['current_streak', 'winning_streak', 'avatar_id']);


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

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  const validate = await validToken(token)

  if (!validate || validate.email === undefined) {
    res.status(401).json({ message: 'Missing or Invalid Token' });
    return null;
  }

  req.user.email = validate.email as string;
  req.user.id = validate.user_Id;
  next();
}


export function validStat(stat: string) {
  return STATS.has(stat);
}

export const cognito_identity_client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!
  }
});

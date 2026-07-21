
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import { NextFunction, Request, Response } from 'express';

import dotenv from "dotenv"
dotenv.config()

const verifier = CognitoJwtVerifier.create({
  userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
  tokenUse: "id",
  clientId: `${process.env.COGNITO_CLIENT_ID}`, //client ID of app, not a userId
});


const STATS = new Set(['current_streak', 'winning_streak', 'avatar_id']);

export const validateToken = async (token: string | undefined) => {
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

  const validate = await validateToken(token)

  if (!validate || validate.email === undefined) {
    res.status(401).json({ message: 'Missing or Invalid Token' });
    return null;
  }

  req.user = {} as any;

  req.user.email = validate.email as string;
  req.user.id = validate.user_Id;
  next();
}


export function validStat(stat: string) {
  return STATS.has(stat);
}




let jwksCache: { keys: any[] } | null = null
let jwksCacheTime = 0
const JWKS_CACHE_TTL = 3600000

async function getJwks(): Promise<any[]> {
  if (jwksCache && Date.now() - jwksCacheTime < JWKS_CACHE_TTL) {
    return jwksCache.keys
  }
  const jwksUri = process.env.COGNITO_JWKS_URI
  if (!jwksUri) throw new Error('COGNITO_JWKS_URI not configured')
  const res = await fetch(jwksUri)
  jwksCache = await res.json() as { keys: any[] }
  jwksCacheTime = Date.now()
  return jwksCache.keys
}

function jwkToPem(jwk: any): string {
  const base64UrlEncode = (buf: Buffer) =>
    buf.toString('base64url')
  const modulus = Buffer.from(jwk.n, 'base64url')
  const exponent = Buffer.from(jwk.e, 'base64url')
  const modulusB64 = base64UrlEncode(modulus)
  const exponentB64 = base64UrlEncode(exponent)
  const pemBody = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA${modulusB64}${exponentB64}`
  return `-----BEGIN PUBLIC KEY-----\n${pemBody}\n-----END PUBLIC KEY-----`
}


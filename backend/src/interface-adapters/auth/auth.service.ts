
import { CognitoJwtVerifier } from 'aws-jwt-verify'
import dotenv from "dotenv"
import { NextFunction, Request, Response } from 'express';
import { IUserRepository } from 'src/application/interfaces/repositories/IUserRepository';
import { STATS, UserDTO } from 'src/interface-adapters/dtos/user.dto'
dotenv.config()

// const verifier = CognitoJwtVerifier.create({
//   userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
//   tokenUse: "id",
//   clientId: `${process.env.COGNITO_CLIENT_ID}`, //client ID of app, not a userId
// });

const verifier = (() => {
  let instance: ReturnType<typeof CognitoJwtVerifier.create> | null = null;
  return () => {
    if (!instance) {
      instance = CognitoJwtVerifier.create({
        userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
        tokenUse: "id",
        clientId: `${process.env.COGNITO_CLIENT_ID}`, //client ID of app, not a userId
      });
    }
    return instance;
  };
})();


export const validateToken = async (token: string | undefined) => {
  if (token === undefined)
    return null;

  try {
    const payload = await verifier().verify(token);
    return {
      user_Id: payload.sub,
      email: payload.email
    };
  }
  catch {
    return null
  }

};

export const requireAuth = (user_repo: IUserRepository) => {

  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    const validate = await validateToken(token)

    if (validate?.email === undefined) {
      res.status(401).json({ message: 'Missing or Invalid Token' });
      return null;
    }

    const db_user = await user_repo.getUserId(validate.user_Id);

    if (!db_user) {
      res.status(404).json({ message: 'Unknown User' });
      return null
    }

    req.user = {
      id: db_user.user_id!,
      email: validate.email as string
    };

    next();
  }

}


export function validStat(stat: string) {
  return STATS.includes(stat as keyof UserDTO)
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


import cors from 'cors'
import express, { Request, Response } from 'express'

import routes from './routes/api.routes';
import { initDB } from './config/db';


initDB();

const app = express();
app.disable('x-powered-by');

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/elo', routes);
app.use('/api/match', routes);
app.use('/api/user',routes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});



//  AWS COGNITO SETUP

export interface CognitoUser {
  sub: string
  email?: string
}

declare global {
  namespace Express {
    interface Request {
      user?: CognitoUser
    }
  }
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

export default app;
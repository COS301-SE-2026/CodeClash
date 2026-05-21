import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import eloRoutes from './routes/api.routes';
import matchRoutes from './routes/api.routes';
import jwt, { type JwtPayload } from 'jsonwebtoken'

const app = express();
app.disable('x-powered-by');

app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:5173'}));
app.use(express.json());
app.use('/api/elo', eloRoutes);
app.use('/api/match', matchRoutes);

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok'});
});

interface CognitoUser {
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

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' } })
    return
  }
  const token = header.slice(7)
  try {
    const decoded = jwt.decode(token, { complete: true })
    if (!decoded || typeof decoded === 'string' || !decoded.header.kid) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } })
      return
    }
    const keys = await getJwks()
    const key = keys.find((k: any) => k.kid === decoded.header.kid)
    if (!key) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token key' } })
      return
    }
    const pem = jwkToPem(key)
    const payload = jwt.verify(token, pem, {
      algorithms: ['RS256'],
      issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
    }) as JwtPayload
    req.user = { sub: payload.sub!, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token verification failed' } })
  }
}

export default app;
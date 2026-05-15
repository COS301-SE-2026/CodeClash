import request from 'supertest'
import app from '../../src/app'

export { request, app }

export const auth = (token: string) => `Bearer ${token}`

export const userAuth = auth('valid-jwt')
export const adminAuth = auth('admin-jwt')
export const otherUserAuth = auth('other-user-jwt')

export const setAuth = (token: string) => (req: any) =>
  req.set('Authorization', `Bearer ${token}`)

export const expectUnauthorized = (res: any) => {
  expect(res.status).toBe(401)
  expect(res.body.error.code).toBe('UNAUTHORIZED')
}

export const expectNotFound = (res: any) => {
  expect(res.status).toBe(404)
  expect(res.body.error.code).toBe('NOT_FOUND')
}

export const expectValidationError = (res: any) => {
  expect(res.status).toBe(400)
  expect(res.body.error.code).toBe('VALIDATION_ERROR')
}

export const expectForbidden = (res: any) => {
  expect(res.status).toBe(403)
  expect(res.body.error.code).toBe('FORBIDDEN')
}

export const expectConflict = (res: any) => {
  expect(res.status).toBe(409)
  expect(res.body.error.code).toBe('CONFLICT')
}

export const expectUnprocessable = (res: any) => {
  expect(res.status).toBe(422)
  expect(res.body.error.code).toBe('UNPROCESSABLE')
}

export const expectStatus = (res: any, status: number) => {
  expect(res.status).toBe(status)
}

export const expectArrayResponse = (res: any) => {
  expect(res.status).toBe(200)
  expect(Array.isArray(res.body)).toBe(true)
}

export const expectPaginated = (res: any, limit: number) => {
  expect(res.status).toBe(200)
  expect(res.body.length).toBeLessThanOrEqual(limit)
}

export const expectEmptyArray = (res: any) => {
  expect(res.status).toBe(200)
  expect(res.body).toEqual([])
}

export const expectShape = (obj: any, props: string[]) => {
  props.forEach((prop) => expect(obj).toHaveProperty(prop))
}

export const expectArrayShape = (arr: any[], props: string[]) => {
  arr.forEach((item: any) => expectShape(item, props))
}

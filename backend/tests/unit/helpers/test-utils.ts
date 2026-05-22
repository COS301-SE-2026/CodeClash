import request from 'supertest'
import app from '../../../src/app'
import { describe, test, expect } from 'vitest';

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

// --- Test factories ---

export const matchActionTests = (action: string, pastTense: string) => {
  describe(`PUT /matches/:match_id/${action}`, () => {
    test(`returns 200 when invited player ${pastTense} match`, async () => {
      const res = await request(app)
        .put(`/matches/1/${action}`)
        .set('Authorization', userAuth)
      expect(res.status).toBe(200)
      expect(res.body.status).toBe(pastTense)
    })

    test('returns 401 without auth', async () => {
      expectUnauthorized(await request(app).put(`/matches/1/${action}`))
    })

    test('returns 404 for non-existent match', async () => {
      expectNotFound(
        await request(app)
          .put(`/matches/99999/${action}`)
          .set('Authorization', userAuth)
      )
    })

    test('returns 400 for non-integer match_id', async () => {
      expectValidationError(
        await request(app)
          .put(`/matches/abc/${action}`)
          .set('Authorization', userAuth)
      )
    })
  })
}

export const paginationValidationTests = (path: string) => {
  test('returns 200 with limit applied', async () => {
    expectPaginated(await request(app).get(`${path}?limit=3`), 3)
  })

  test('returns 200 with offset applied', async () => {
    expectArrayResponse(await request(app).get(`${path}?offset=2`))
  })

  test('returns 400 for negative limit', async () => {
    expectValidationError(await request(app).get(`${path}?limit=-1`))
  })

  test('returns 400 for non-integer offset', async () => {
    expectValidationError(await request(app).get(`${path}?offset=abc`))
  })
}

export const subResourceTests = (
  listPath: string,
  singlePath: string,
  label: string
) => {
  describe(`${listPath}/:${label}_id`, () => {
    test(`returns 200 with ${label} details`, async () => {
      const res = await request(app).get(`${singlePath}/1`)
      expect(res.status).toBe(200)
      expectShape(res.body, [`${label}_id`])
      expect(res.body[`${label}_id`]).toBe(1)
    })

    test(`returns 404 for non-existent ${label}`, async () => {
      expectNotFound(await request(app).get(`${singlePath}/99999`))
    })

    test(`returns 400 for non-integer ${label}_id`, async () => {
      expectValidationError(await request(app).get(`${singlePath}/abc`))
    })
  })
}

export const userSubResourceTests = (subPath: string, label: string) => {
  describe(`GET /users/:user_id/${subPath}`, () => {
    test(`returns 200 with ${label} for user`, async () => {
      const res = await request(app).get(`/users/42/${subPath}`)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })

    test(`returns 200 with empty array for user with no ${label}`, async () => {
      const res = await request(app).get(`/users/1/${subPath}`)
      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    test(`returns 404 for non-existent user`, async () => {
      expectNotFound(await request(app).get(`/users/99999/${subPath}`))
    })

    test(`returns 400 for invalid user_id`, async () => {
      expectValidationError(
        await request(app).get(`/users/abc/${subPath}`)
      )
    })
  })
}

export const adminGuardTests = (method: 'post' | 'put' | 'delete', path: string, body?: any) => {
  test('returns 403 when regular user', async () => {
    expectForbidden(
      await request(app)[method](path)
        .set('Authorization', userAuth)
        .send(body)
    )
  })
  test('returns 401 without auth', async () => {
    expectUnauthorized(await request(app)[method](path).send(body))
  })
}

export const idValidationTests = (path: string, notFoundId = '99999', suffix = '') => {
  test('returns 404 for non-existent resource', async () => {
    expectNotFound(await request(app).get(`${path}/${notFoundId}${suffix}`))
  })
  test('returns 400 for non-integer id', async () => {
    expectValidationError(await request(app).get(`${path}/abc${suffix}`))
  })
}

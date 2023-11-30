const supertest = require('supertest')
const app = require('../app')
const db = require('../database/firestore')

const deleteUser = async () => {
  const doc = await db.collection('users').doc('testuser')
  doc.delete()
}

beforeAll(() => deleteUser())
afterAll(() => deleteUser())

describe('Authentication API Tests (Register & Login)', () => {
  test('[POST /api/register] Register a new user', async () => {
    const response = await supertest(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        name: 'Test User',
        noTelepon: '1234567890',
        password: 'testpassword',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe(true)
    expect(response.body.token).toBeDefined()
    expect(response.body.user.username).toBe('testuser')
  })

  test('[POST /api/register] Register with invalid data', async () => {
    const response = await supertest(app)
      .post('/api/register')
      .send({
        username: 'testuser',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
  })

  test('[POST /api/login] Login with valid credentials', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe(true)
    expect(response.body.token).toBeDefined()
    expect(response.body.user.username).toBe('testuser')
  })

  test('[POST /api/login] Login with invalid credentials', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
  })
})

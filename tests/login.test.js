const supertest = require('supertest')
const app = require('../app')
const db = require('../database/firestore')

const testUser = {
  username: 'testuser',
  name: 'Test User',
  noTelepon: '628123456789',
  password: 'testpassword',
}

const deleteUser = async () => {
  const doc = db.collection('users').doc('testuser')
  await doc.delete()
}

beforeAll(() => deleteUser())
afterAll(() => deleteUser())

describe('Authentication API Tests (Register & Login)', () => {
  test('[POST /api/register] Register a new user', async () => {
    const response = await supertest(app)
      .post('/api/register')
      .send(testUser)

    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe(true)
    expect(response.body.token).toBeDefined()
    expect(response.body.user.username).toBe('testuser')
  })

  test('[POST /api/register] Register with invalid data', async () => {
    const response = await supertest(app)
      .post('/api/register')
      .send({
        username: testUser.username,
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
  })

  test('[POST /api/register] Register with invalid password', async () => {
    const response = await supertest(app)
      .post('/api/register')
      .send({
        ...testUser,
        password: '1',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
  })

  test('[POST /api/register] Register with invalid noTelepon', async () => {
    const response = await supertest(app)
      .post('/api/register')
      .send({
        ...testUser,
        noTelepon: '1',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
  })

  test('[POST /api/register] Register with same another noTelepon user', async () => {
    const response = await supertest(app)
      .post('/api/register')
      .send({
        username: 'testuser2',
        name: 'Test User 2',
        noTelepon: testUser.noTelepon,
        password: 'testpassword',
      })

    expect(response.statusCode).toBe(409)
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe('noTelepon is already exist')
  })

  test('[POST /api/login] Login with valid credentials', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        username: testUser.username,
        password: testUser.password,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe(true)
    expect(response.body.token).toBeDefined()
    expect(response.body.message).toBe('login success')
    expect(response.body.user.username).toBe('testuser')
  })

  test('[POST /api/login] Login with valid noTelepon', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        noTelepon: testUser.noTelepon,
        password: testUser.password,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe(true)
  })

  test('[POST /api/login] Login with invalid username', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        username: 'testuser-that-did-not-exist-in-the-database',
        password: testUser.password,
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe('invalid username')
  })

  test('[POST /api/login] Login with invalid noTelepon', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        noTelepon: '622',
        password: testUser.password,
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe('invalid noTelepon')
  })

  test('[POST /api/login] Login with invalid password', async () => {
    const response = await supertest(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      })

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
    expect(response.body.message).toBe('invalid password')
  })
})

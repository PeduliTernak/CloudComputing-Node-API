const supertest = require('supertest')
const app = require('../app')
const db = require('../database/firestore')

const testUserCredentials = {
  username: 'testuser',
  name: 'Test User',
  noTelepon: '1234567890',
  password: 'testpassword',
}

beforeAll(async () => {
  // Delete 'testuser' user
  const doc = await db.collection('users').doc('testuser')
  doc.delete()

  // Register the test user
  await supertest(app)
    .post('/api/register')
    .send(testUserCredentials)

  // Log in the test user and get the token
  const loginResponse = await supertest(app)
    .post('/api/login')
    .send({
      username: testUserCredentials.username,
      password: testUserCredentials.password,
    })

  // Set the token for subsequent requests
  testUserCredentials.token = loginResponse.body.token
})

describe('Users API Tests', () => {
  test('[GET /api/user] Get user profile', async () => {
    const response = await supertest(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${testUserCredentials.token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe(true)
    expect(response.body.users).toBeDefined()
  })

  test('[PUT /api/user] Update user data', async () => {
    const updatedUserData = {
      name: 'Updated Name',
      noTelepon: '9876543210',
      password: 'newpassword',
    }

    const response = await supertest(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${testUserCredentials.token}`)
      .send(updatedUserData)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe(true)
    expect(response.body.message).toBe('user data updated successfully')
    expect(response.body.user).toBeDefined()
  })

  test('[PUT /api/user] Update user data with invalid request', async () => {
    const response = await supertest(app)
      .put('/api/user')
      .set('Authorization', `Bearer ${testUserCredentials.token}`)
      .send({})

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe(false)
  })

  test('[DELETE /api/user] Delete user', async () => {
    const response = await supertest(app)
      .delete('/api/user')
      .set('Authorization', `Bearer ${testUserCredentials.token}`)

    expect(response.statusCode).toBe(204)
  })
})

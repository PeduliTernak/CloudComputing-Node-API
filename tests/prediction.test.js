const supertest = require('supertest')
const path = require('path')
const app = require('../app')
const { isImageExistsInBucket } = require('../middleware/cloudStorage')
const { getImageName } = require('../helpers/helpers')

// IMPORTANT: Add an image.jpg before running the tests
const imagePath = path.resolve(__dirname, 'image.jpg')

const testUserCredentials = {
  username: 'testuser',
  name: 'Test User',
  noTelepon: '628123456789',
  password: 'testpassword',
}

const deleteUser = async () => {
  await supertest(app)
    .delete('/api/user')
    .set('Authorization', `Bearer ${testUserCredentials.token}`)
}

beforeAll(async () => {
  // Delete 'testuser' user
  await deleteUser()

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

afterAll(deleteUser)

describe('Prediction Router', () => {
  const predictionResult = {
    status: false,
    prediction: {
      id: '',
      imageUrl: '',
      result: '',
    },
  }

  it('[POST /api/prediction] should predict the image and save it to the database', async () => {
    const matrix = [
      1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    ]
    const response = await supertest(app)
      .post('/api/prediction')
      .set('Authorization', `Bearer ${testUserCredentials.token}`)
      .attach('file', imagePath)
      .field('gejala_matrix', JSON.stringify(matrix))

    expect(response.status).toBe(200)
    expect(response.body.status).toBe(true)
    expect(response.body.prediction).toHaveProperty('id')
    expect(response.body.prediction).toHaveProperty('imageUrl')
    expect(response.body.prediction).toHaveProperty('result')

    predictionResult.status = response.body.status
    predictionResult.prediction.id = response.body.prediction.id
    predictionResult.prediction.imageUrl = response.body.prediction.imageUrl
    predictionResult.prediction.result = response.body.prediction.result

    // Assertions related to Cloud Storage
    const isImageExists = await isImageExistsInBucket(getImageName(predictionResult.prediction))
    expect(isImageExists).toBe(true)
  }, 60000)

  it('[GET /api/prediction] should get all user\'s prediction history', async () => {
    const response = await supertest(app)
      .get('/api/prediction')
      .set('Authorization', `Bearer ${testUserCredentials.token}`)

    expect(response.status).toBe(200)
    expect(response.body.status).toBe(true)
    expect(response.body.predictions).toBeInstanceOf(Array)
    expect(response.body.predictions).toHaveLength(1)
    expect(response.body.predictions[0]).toMatchObject(predictionResult.prediction)

    // Assertions related to Cloud Storage
    const isImageExists = await isImageExistsInBucket(
      getImageName(response.body.predictions[0]),
    )
    expect(isImageExists).toBe(true)
  })

  it('[GET /api/prediction/:id] should get prediction history by id', async () => {
    const response = await supertest(app)
      .get(`/api/prediction/${predictionResult.prediction.id}`)
      .set('Authorization', `Bearer ${testUserCredentials.token}`)

    expect(response.status).toBe(200)
    expect(response.body.status).toBe(true)
    expect(response.body.prediction).toMatchObject(predictionResult.prediction)

    // Assertions related to Cloud Storage
    const isImageExists = await isImageExistsInBucket(getImageName(predictionResult.prediction))
    expect(isImageExists).toBe(true)
  })

  it('[DELETE /api/prediction/:id] should delete prediction history by id', async () => {
    const response = await supertest(app)
      .delete(`/api/prediction/${predictionResult.prediction.id}`)
      .set('Authorization', `Bearer ${testUserCredentials.token}`)

    expect(response.status).toBe(204)

    // Assertions related to Cloud Storage
    const isImageExists = await isImageExistsInBucket(getImageName(predictionResult.prediction))
    expect(isImageExists).toBe(false)
  })
})

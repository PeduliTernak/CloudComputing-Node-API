const predictionRouter = require('express').Router()

const db = require('../database/firestore')
const storage = require('../database/cloudstorage')
const { tokenValidator } = require('../middleware/authentication')

predictionRouter.post('/', tokenValidator, async (request, response) => {
  console.log(request.user)
  request.prediction = 'penyakit1'

  // upload GAMBAR ke cloud storage

  // dapetin link gambarnya

  await db.doc('predictionHistory/huruf-random').set({
    idUser: db.doc(`users/${request.user.username}`),
    imageUrl: 'https://storage.com/sapi.jpg',
    predictionResult: request.prediction,
  })

  response.json({ prediksi: request.prediction })
})

predictionRouter.get('/', tokenValidator, async (request, response) => {
  response.json({ method: 'get' })
})

predictionRouter.get('/:id', tokenValidator, async (request, response) => {
  response.json({ method: 'get id' })
})

predictionRouter.delete('/', tokenValidator, async (request, response) => {
  response.json({ method: 'delete' })
})

module.exports = predictionRouter

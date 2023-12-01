const predictionRouter = require('express').Router()

const db = require('../database/firestore')
const { tokenValidator } = require('../middleware/authentication')
const { multerUpload, checkFile } = require('../middleware/middleware')
const { performImagePrediction } = require('../middleware/predictionService')

const steps = [
  multerUpload.single('file'), checkFile, performImagePrediction,
]
predictionRouter.post('/', tokenValidator, steps, async (request, response) => {
  const data = {
    idUser: db.collection('users').doc(request.user.username),
    imageUrl: 'UNIMPLEMENTED.image.jpg',
    predictionResult: request.prediction.prediction,
  }

  await db.collection('predictionHistory').doc().set(data)

  response.json({
    status: true,
    predictionResult: request.prediction,
    imageUrl: data.imageUrl,
  })
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

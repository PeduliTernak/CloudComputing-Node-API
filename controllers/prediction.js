const predictionRouter = require('express').Router()

const db = require('../database/firestore')
const { tokenValidator } = require('../middleware/authentication')
const { multerUpload, checkFile } = require('../middleware/middleware')
const { performImagePrediction } = require('../middleware/predictionService')
const { generateRandomString } = require('../helpers/helpers')

const steps = [
  multerUpload.single('file'), checkFile, performImagePrediction,
]
predictionRouter.post('/', tokenValidator, steps, async (request, response) => {
  const data = {
    idUser: db.collection('users').doc(request.user.username),
    imageUrl: 'UNIMPLEMENTED.image.jpg',
    predictionResult: request.prediction.prediction,
  }

  const documentId = `${request.user.username}-${generateRandomString(20)}`
  await db.collection('predictionHistory').doc(documentId).set(data)

  response.json({
    status: true,
    id: documentId,
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

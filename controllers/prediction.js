const predictionRouter = require('express').Router()

const db = require('../database/firestore')
const { tokenValidator } = require('../middleware/authentication')
const { multerUpload, checkFile } = require('../middleware/multer')
const { performImagePrediction } = require('../middleware/predictionService')
const { uploadImage } = require('../middleware/cloudStorage')

const steps = [
  multerUpload.single('file'), checkFile, performImagePrediction, uploadImage,
]
predictionRouter.post('/', tokenValidator, steps, async (request, response) => {
  const data = {
    idUser: db.collection('users').doc(request.user.username),
    imageUrl: request.storageObject.publicUrl,
    predictionResult: request.prediction.prediction,
  }

  const documentId = `${request.user.username}-${request.storageObject.id}`
  await db.collection('predictionHistory').doc(documentId).set(data)

  response.json({
    status: true,
    id: documentId,
    imageUrl: data.imageUrl,
    predictionResult: data.predictionResult,
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

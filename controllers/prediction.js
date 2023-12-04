const predictionRouter = require('express').Router()

const db = require('../database/firestore')
const { tokenValidator } = require('../middleware/authentication')
const { multerUpload, checkFile } = require('../middleware/multer')
const { performImagePrediction } = require('../middleware/predictionService')
const { uploadImage, deleteImages } = require('../middleware/cloudStorage')
const { getImageName } = require('../helpers/helpers')

const steps = [
  multerUpload.single('file'),
  checkFile,
  performImagePrediction,
  uploadImage,
]
predictionRouter.post('/', tokenValidator, steps, async (request, response) => {
  const data = {
    idUser: db.collection('users').doc(request.user.username),
    imageUrl: response.locals.storageObject.publicUrl,
    result: response.locals.prediction.prediction,
  }

  const documentId = `${request.user.username}-${response.locals.storageObject.id}`
  await db.collection('predictionHistory').doc(documentId).set(data)

  response.json({
    status: true,
    prediction: {
      id: documentId,
      imageUrl: data.imageUrl,
      result: data.result,
    },
  })
})

predictionRouter.get('/', tokenValidator, async (request, response) => {
  const col = db.collection('predictionHistory')
  const snapshot = await col
    .where('idUser', '==', db.collection('users').doc(request.user.username))
    .get()

  const data = []
  snapshot.forEach((doc) => {
    const { imageUrl, result } = { ...doc.data() }
    data.push({ id: doc.id, imageUrl, result })
  })

  response.json({
    status: true,
    predictions: data,
  })
})

predictionRouter.get('/:id', tokenValidator, async (request, response) => {
  const { id } = request.params

  const docSnapshot = await db.collection('predictionHistory').doc(id).get()
  const data = docSnapshot.data()

  if (data === undefined) {
    response.status(404).json({
      status: true,
      error: 'prediction id is not found',
    })
    return
  }

  const { imageUrl, result } = data

  response.json({
    status: true,
    prediction: { id, imageUrl, result },
  })
})

predictionRouter.delete('/:id', tokenValidator, async (request, response) => {
  const { id } = request.params

  const doc = db.collection('predictionHistory').doc(id)
  const docSnapshot = await doc.get()
  const data = docSnapshot.data()

  if (data === undefined) {
    response.status(404).json({
      status: true,
      error: 'prediction id is not found',
    })
    return
  }

  const imageName = getImageName(data)

  Promise.resolve(...deleteImages([imageName]))
  await doc.delete()

  response.status(204).end()
})

module.exports = predictionRouter

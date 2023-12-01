const multer = require('multer')
const predictionRouter = require('express').Router()

const { tokenValidator } = require('../middleware/authentication')
const { performImagePrediction } = require('../middleware/predictionService')

// Multer configuration with memory storage
// Limit 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

// Check uploaded file
const checkFile = (request, response, next) => {
  if (request.file === undefined) {
    response.status(400).json({
      status: false,
      error: 'please specify an image in form-data',
    })
    return
  }
  next()
}

const steps = [tokenValidator, upload.single('file'), checkFile, performImagePrediction]
predictionRouter.post('/', steps, async (request, response) => {
  response.json({
    status: true,
    result: request.prediction,
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

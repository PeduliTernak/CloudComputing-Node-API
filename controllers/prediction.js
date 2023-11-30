const multer = require('multer')
const predictionRouter = require('express').Router()

const { tokenValidator } = require('../middleware/authentication')

// Multer configuration with memory storage
// Limit 3MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
})

predictionRouter.post('/', tokenValidator, upload.single('file'), async (request, response) => {
  const uploadedFile = request.file
  if (uploadedFile === undefined) {
    response.status(400).json({
      status: false,
      error: 'please specify an image in form-data',
    })
    return
  }

  response.json({
    filename: uploadedFile.originalname,
    size: uploadedFile.size,
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

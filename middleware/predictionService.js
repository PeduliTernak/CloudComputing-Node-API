const axios = require('axios')

const { PREDICTION_MICRO_SERVICE_URL } = require('../utils/config')

const performImagePrediction = async (request, response, next) => {
  // Convert the Buffer to a Blob
  const blobData = Buffer.from(request.file.buffer)
  const blob = new Blob([blobData], { type: request.file.mimetype })

  // Configure form-data
  const formData = new FormData()
  formData.append('file', blob, { filename: 'image.jpg' })

  // Send request to Python-Flask app
  const predictionResult = await axios.post(PREDICTION_MICRO_SERVICE_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  // Check if contains error when predict the image
  if (!predictionResult.data.status) {
    throw new Error(predictionResult.data.error)
  }

  // Store prediction result
  response.locals.prediction = predictionResult.data

  next()
}

module.exports = {
  performImagePrediction,
}

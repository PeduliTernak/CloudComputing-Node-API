const axios = require('axios')

const { PREDICTION_MICRO_SERVICE_URL } = require('../utils/config')

const performImagePrediction = async (request, response, next) => {
  try {
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

    // Store prediction result
    request.prediction = predictionResult.data

    next()
  } catch (error) {
    console.error('Error performing image prediction:', error.message)
    response.status(500).json({
      status: false,
      error: 'Failed to perform image prediction',
    })
  }
}

module.exports = {
  performImagePrediction,
}

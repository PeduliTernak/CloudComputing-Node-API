const axios = require('axios')

const {
  PREDICTION_MICRO_SERVICE_URL,
  CLOUD_RUN_INVOKER_SERVICE_ACCOUNT_KEY_FILE,
} = require('../utils/config')
const getAuthToken = require('../services/auth')

const performImagePrediction = async (request, response, next) => {
  // Get ID token to authenticate Cloud Run endpoint
  let idToken
  try {
    idToken = await getAuthToken(
      PREDICTION_MICRO_SERVICE_URL,
      CLOUD_RUN_INVOKER_SERVICE_ACCOUNT_KEY_FILE,
    )
  } catch (error) {
    console.info('Note: Cloud Run Invoker service account is not specified.')
    idToken = ''
  }

  // Convert the Buffer to a Blob
  const blobData = Buffer.from(request.file.buffer)
  const blob = new Blob([blobData], { type: request.file.mimetype })

  // Configure form-data
  const formData = new FormData()
  formData.append('file', blob, { filename: 'image.jpg' })
  formData.append('gejala_matrix', request.body.gejala_matrix)

  // Send request to Python-Flask app
  const predictionResult = await axios.post(PREDICTION_MICRO_SERVICE_URL, formData, {
    headers: {
      Authorization: `Bearer ${idToken}`,
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

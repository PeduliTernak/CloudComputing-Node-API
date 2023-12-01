const storage = require('../database/cloudstorage')
const { generateRandomString } = require('../helpers/helpers')
const { BUCKET } = require('../utils/config')

const bucket = storage.bucket(BUCKET)

const uploadImage = async (request, response, next) => {
  try {
    // Create Unique ID and File Name for Object
    const id = generateRandomString(25)
    request.storageObject = {}
    request.storageObject.id = id
    request.storageObject.fileName = `${request.user.username}-${id}-${request.file.originalname}`
    const file = bucket.file(request.storageObject.fileName)

    // Write Stream
    const stream = file.createWriteStream({
      metadata: {
        contentType: request.file.mimetype,
      },
    })
    stream.end(request.file.buffer)

    // Wait for the file to be fully uploaded
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve)
      stream.on('error', reject)
    })

    // Store publicUrl
    request.storageObject.publicUrl = `https://storage.googleapis.com/${BUCKET}/${request.storageObject.fileName}`
    next()
  } catch (error) {
    console.error(error)
    response.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    })
  }
}

module.exports = {
  uploadImage,
}

const storage = require('../database/cloudstorage')
const { generateRandomString } = require('../helpers/helpers')
const { BUCKET } = require('../utils/config')

const bucket = storage.bucket(BUCKET)

const uploadImage = async (request, response, next) => {
  // Create Unique ID and File Name for Object
  const id = generateRandomString(25)
  const fileName = `${request.user.username}-${id}-${request.file.originalname}`
  const file = bucket.file(fileName)

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

  // Store data to response.locals
  response.locals.storageObject = {
    id,
    fileName,
    publicUrl: `https://storage.googleapis.com/${BUCKET}/${fileName}`,
  }
  next()
}

const deleteImages = (files) => {
  // Return array of promises
  const deletePromises = files.map((file) => bucket.file(file).delete())
  return deletePromises
}

module.exports = {
  uploadImage,
  deleteImages,
}

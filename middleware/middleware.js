const multer = require('multer')

// Multer configuration with memory storage
// Limit 5MB
const multerUpload = multer({
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

module.exports = {
  multerUpload,
  checkFile,
}

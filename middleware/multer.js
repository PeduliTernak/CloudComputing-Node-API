const multer = require('multer')

// Custom error class for files that are not images
class FileNotImageError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FileNotImageError'
  }
}

// Custom validation function to check if the file is an image
const imageFilter = (_, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new FileNotImageError('File is not an image'), false)
    return
  }
  cb(null, true)
}

// Multer configuration with memory storage
// Limit 5MB
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: imageFilter,
})

// Check uploaded file
const checkFile = (request, response, next) => {
  if (request.file === undefined) {
    throw new FileNotImageError('File is empty')
  }
  next()
}

module.exports = {
  multerUpload,
  checkFile,
}

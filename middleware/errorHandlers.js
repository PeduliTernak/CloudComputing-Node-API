const unknownEndpoint = (request, response) => {
  response.status(404).json({
    status: false,
    error: 'unknown endpoint',
  })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'JsonWebTokenError') {
    response.status(400).json({
      status: false,
      error: error.message,
    })
  } else if (error.name === 'TokenExpiredError') {
    response.status(400).json({
      status: false,
      error: 'token expired',
    })
  } else if (error.name === 'MulterError') {
    response.status(400).json({
      status: false,
      error: 'please specify form-data with key:\'file\' and value:image.jpg',
    })
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}

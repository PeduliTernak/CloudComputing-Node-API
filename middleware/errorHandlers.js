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
    if (error.message === 'Unexpected field') {
      response.status(400).json({
        status: false,
        error: 'please specify form-data with \'file\' key',
      })
    } else if (error.message === 'File too large') {
      response.status(400).json({
        status: false,
        error: 'maximum file is 3MB',
      })
    }
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}

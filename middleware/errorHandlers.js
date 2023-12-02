const unknownEndpoint = (request, response) => {
  response.status(404).json({
    status: false,
    error: 'unknown endpoint',
  })
}

const errorHandler = (error, request, response, next) => {
  const errorMappings = {
    JsonWebTokenError: {
      status: 400,
      message: error.message,
    },
    TokenExpiredError: {
      status: 400,
      message: 'token expired',
    },
    MulterError: {
      'Unexpected field': {
        status: 400,
        message: 'please specify form-data with \'file\' key',
      },
      'File too large': {
        status: 400,
        message: 'maximum file size is 3MB',
      },
    },
  }

  let errorInfo = errorMappings[error.name] || { status: 500, message: 'Internal Server Error' }
  errorInfo = errorInfo[error.message] || errorInfo

  if (errorInfo.status === 500) {
    console.error(error)
  }

  response.status(errorInfo.status).json({
    status: false,
    error: errorInfo.message,
  })

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}

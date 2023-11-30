const unknownEndpoint = (request, response) => {
  response.status(404).json({
    status: false,
    error: 'unknown endpoint',
  })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  const errorJson = { status: false, error: error.message }

  if (error.name === 'JsonWebTokenError') {
    response.status(400).json(errorJson)
  } else if (error.name === 'TokenExpiredError') {
    response.status(401).json({ ...errorJson, error: 'token expired' })
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
}

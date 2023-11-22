const errorHandler = (error, request, response, next) => {
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(400).send({
    status: false,
    error: 'unknown endpoint',
  })
}

module.exports = {
  errorHandler,
  unknownEndpoint,
}

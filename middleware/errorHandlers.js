const unknownEndpoint = (request, response) => {
  response.status(404).json({
    status: false,
    error: 'unknown endpoint',
  })
}

module.exports = {
  unknownEndpoint,
}

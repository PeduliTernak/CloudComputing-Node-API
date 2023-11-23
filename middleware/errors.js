const unknownEndpoint = (request, response) => {
  response.status(400).send({
    status: false,
    error: 'unknown endpoint',
  })
}

module.exports = {
  unknownEndpoint,
}

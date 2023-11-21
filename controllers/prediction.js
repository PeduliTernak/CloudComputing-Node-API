const predictionRouter = require('express').Router()

predictionRouter.get('/', (request, response) => {
  response.json({ status: 'history' })
})

module.exports = predictionRouter

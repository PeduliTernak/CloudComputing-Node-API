const predictionRouter = require('express').Router()

const db = require('../database/firestore')

predictionRouter.get('/', (request, response) => {
  response.json({ status: 'history' })
})

module.exports = predictionRouter

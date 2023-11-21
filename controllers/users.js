const usersRouter = require('express').Router()

usersRouter.get('/', (request, response) => {
  response.json({ status: 'user' })
})

module.exports = usersRouter

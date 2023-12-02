require('express-async-errors')

const express = require('express')
const cors = require('cors')

const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const predictionRouter = require('./controllers/prediction')
const errorHandlers = require('./middleware/errorHandlers')
const middleware = require('./middleware/middleware')

const app = express()

app.use(cors())
app.use(express.json())
app.get('/', middleware.home)

// Routes
app.use('/api', loginRouter)
app.use('/api/user', usersRouter)
app.use('/api/prediction', predictionRouter)

// Error Handlers
app.use(errorHandlers.errorHandler)
app.use(errorHandlers.unknownEndpoint)

module.exports = app

const express = require('express')
const cors = require('cors')

const errors = require('./middleware/errors')
const usersRouter = require('./controllers/users')
const predictionRouter = require('./controllers/prediction')
const pool = require('./database/db')

const app = express()

app.use(cors())
app.use(express.json())

// Pass the pool to all routers
app.use((request, response, next) => {
  request.pool = pool
  next()
})

// Routes
app.get('/', (request, response) => response.json({ status: 'OK' }))
app.use('/api/user', usersRouter)
app.use('/api/prediction', predictionRouter)

// Error Handlers
app.use(errors.unknownEndpoint)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

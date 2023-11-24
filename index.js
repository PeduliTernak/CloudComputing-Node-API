const express = require('express')
const cors = require('cors')

const errors = require('./middleware/errors')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const predictionRouter = require('./controllers/prediction')
const db = require('./database/firestore')

const app = express()

app.use(cors())
app.use(express.json())

// Pass the pool to all routers
app.use((request, response, next) => {
  request.db = db
  next()
})

// Routes
app.get('/', (request, response) => response.json({ status: 'OK' }))
app.use('/api', loginRouter)
app.use('/api/user', usersRouter)
app.use('/api/prediction', predictionRouter)

// Error Handlers
app.use(errors.unknownEndpoint)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

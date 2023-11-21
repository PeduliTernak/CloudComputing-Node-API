const express = require('express')
const cors = require('cors')

const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const predictionRouter = require('./controllers/prediction')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => response.json({ status: 'OK' }))
app.use('/api/user', usersRouter)
app.use('/api/prediction', predictionRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

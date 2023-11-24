const express = require('express')
const cors = require('cors')

const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const predictionRouter = require('./controllers/prediction')

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api', loginRouter)
app.use('/api/user', usersRouter)
app.use('/api/prediction', predictionRouter)

// Error Handlers
app.use((request, response) => {
  response.status(400).send({
    status: false,
    error: 'unknown endpoint',
  })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

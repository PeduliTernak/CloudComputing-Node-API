const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

const db = require('../database/firestore')
const { SECRET } = require('../utils/config')
const {
  passwordValidator,
  noTeleponValidator,
  checkPhoneNumberExistence,
  checkUsernameExistence,
} = require('../middleware/middleware')

const createToken = ({ id, username }) => {
  const token = jwt.sign({ id, username }, SECRET, { expiresIn: '90d' })
  return token
}

const steps = [
  passwordValidator,
  noTeleponValidator,
  checkUsernameExistence,
  checkPhoneNumberExistence,
]
loginRouter.post('/register', steps, async (request, response) => {
  const {
    username, name, password, noTelepon,
  } = request.body

  // Check given body
  if (!(username && name && noTelepon && password)) {
    return response.status(400).json({
      status: false,
      message: 'invalid request argument',
    })
  }

  // Check if username is already exist in the database
  const data = (await db.collection('users').doc(username).get()).data()
  if (data !== undefined) {
    return response.status(409).json({
      status: false,
      message: 'username is already exist',
    })
  }

  // Hash the password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Save New User to the database
  const newUser = {
    username, name, noTelepon, passwordHash,
  }
  const usersCol = db.collection('users')
  await usersCol.doc(username).set(newUser)

  // Create Token
  const token = createToken({
    id: username,
    username,
  })

  // Send JSON
  return response.status(201).json({
    status: true,
    message: 'register success',
    token,
    user: {
      username: newUser.username,
      name: newUser.name,
      noTelepon: newUser.noTelepon,
    },
  })
})

loginRouter.post('/login', async (request, response) => {
  const { username, noTelepon, password } = request.body

  // Check given body
  if (!((username || noTelepon) && password)) {
    return response.status(400).json({
      status: false,
      message: 'invalid request argument',
    })
  }

  // Check (username or noTelepon) and password validity from Body
  const col = db.collection('users')
  let user

  if (username) {
    // If user login using username
    const snapshot = await col.where('username', '==', username).get()
    snapshot.forEach((doc) => {
      if (doc.data().username === username) {
        user = { id: doc.id, ...doc.data() }
      }
    })
  } else {
    // If user login using noTelepon
    const snapshot = await col.where('noTelepon', '==', noTelepon).get()
    snapshot.forEach((doc) => {
      if (doc.data().noTelepon === noTelepon) {
        user = { id: doc.id, ...doc.data() }
      }
    })
  }

  if (!user) {
    return response.status(400).json({
      status: false,
      message: `invalid ${username ? 'username' : 'noTelepon'}`,
    })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordCorrect) {
    return response.status(400).json({
      status: false,
      message: 'invalid password',
    })
  }

  // Create Token
  const token = createToken({
    id: user.id,
    username: user.username,
  })

  // Send JSON
  return response.json({
    status: true,
    message: 'login success',
    token,
    user: {
      username: user.username,
      name: user.name,
      noTelepon: user.noTelepon,
    },
  })
})

loginRouter.all('/register', (_, response) => response
  .status(405)
  .json({
    status: false,
    message: 'method not allowed',
  }))

loginRouter.all('/login', (_, response) => response
  .status(405)
  .json({
    status: false,
    message: 'method not allowed',
  }))

module.exports = loginRouter

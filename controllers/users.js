const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

const db = require('../database/firestore')
const { tokenValidator } = require('../middleware/authentication')

usersRouter.get('/all', tokenValidator, async (request, response) => {
  const col = db.collection('users')
  const snapshot = await col.get()

  const data = []
  snapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() })
  })

  return response.json({
    status: true,
    users: data,
  })
})

usersRouter.get('/', tokenValidator, async (request, response) => {
  response.json({
    status: true,
    users: {
      username: request.user.username,
      name: request.user.name,
      noTelepon: request.user.noTelepon,
    },
  })
})

usersRouter.put('/', tokenValidator, async (request, response) => {
  const { name, noTelepon, password } = request.body

  if (!name && !noTelepon && !password) {
    return response.status(400).json({
      status: false,
      error: 'invalid request argument',
    })
  }

  const col = db.collection('users')
  const docs = await col.doc(request.user.username)
  const userFromDb = (await docs.get()).data()

  const saltRounds = 10

  const newUser = {
    name: name || userFromDb.name,
    noTelepon: noTelepon || userFromDb.noTelepon,
    passwordHash: password ? (await bcrypt.hash(password, saltRounds)) : userFromDb.passwordHash,
  }

  await docs.update(newUser)

  return response.json({
    status: true,
    message: 'user data updated successfully',
    user: {
      username: request.user.username,
      name: newUser.name,
      noTelepon: newUser.noTelepon,
    },
  })
})

usersRouter.delete('/', tokenValidator, async (request, response) => {
  const document = db.doc(`users/${request.user.username}`)
  await document.delete()
  return response.status(204).end()
})

module.exports = usersRouter

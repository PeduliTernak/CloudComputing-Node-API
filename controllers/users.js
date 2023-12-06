const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

const db = require('../database/firestore')
const { tokenValidator } = require('../middleware/authentication')
const { passwordValidator, noTeleponValidator } = require('../middleware/middleware')
const { deleteImages } = require('../middleware/cloudStorage')
const { getImageName } = require('../helpers/helpers')

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

usersRouter.put('/', tokenValidator, passwordValidator, noTeleponValidator, async (request, response) => {
  const { name, noTelepon, password } = request.body

  if (!name && !noTelepon && !password) {
    return response.status(400).json({
      status: false,
      message: 'invalid request argument',
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
  const user = db.collection('users').doc(request.user.username)
  const query = db
    .collection('predictionHistory')
    .where('idUser', '==', db.collection('users').doc(request.user.username))

  const deleteQueryBatch = async () => {
    const snapshot = await query.get()
    const batchSize = snapshot.size

    // No documents to delete, return a resolved promise
    if (batchSize === 0) {
      return Promise.resolve()
    }

    // Get all image names
    const files = []
    snapshot.forEach((doc) => {
      getImageName(doc.data())
    })

    // Promise to delete documents in a batch
    const batchPromises = snapshot.docs.map((doc) => db.batch().delete(doc.ref).commit())

    // Promise to delete images in the bucket
    const deletePromises = deleteImages(files)

    return Promise.all(batchPromises, deletePromises)
  }

  await deleteQueryBatch()
  await user.delete()
  return response.status(204).end()
})

module.exports = usersRouter

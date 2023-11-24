const usersRouter = require('express').Router()

const { tokenValidator } = require('../middleware/authentication')
const db = require('../database/firestore')

usersRouter.get('/', tokenValidator, async (request, response) => {
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

module.exports = usersRouter

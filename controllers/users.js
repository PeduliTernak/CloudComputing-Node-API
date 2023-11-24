const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
  const col = request.db.collection('users')
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

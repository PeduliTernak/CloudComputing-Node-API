const usersRouter = require('express').Router()

usersRouter.get('/', (request, response) => {
  request.pool.query('SELECT * FROM user WHERE username = ?', ['john_doe'], (err, rows, field) => {
    console.log(rows)
    console.log(field)
    response.json({ user: rows[0] })
  })
})

module.exports = usersRouter

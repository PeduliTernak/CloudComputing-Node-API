const jwt = require('jsonwebtoken')

const db = require('../database/firestore')
const { SECRET } = require('../utils/config')

const tokenValidator = async (request, response, next) => {
  const unauthorizedJson = {
    status: false,
    error: 'unauthorized access',
  }

  // Get token from Request Header
  const authorization = request.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    response.status(401).json(unauthorizedJson)
    return
  }
  const token = authorization.replace('Bearer ', '')

  // Verify the token validity
  let decodedToken = {}
  decodedToken = jwt.verify(token, SECRET)

  if (!decodedToken.username) {
    response.status(401).json(unauthorizedJson)
    return
  }

  // Check if username is exist or not in the Database
  const data = (await db.collection('users').doc(decodedToken.username).get()).data()
  if (data === undefined) {
    response.status(401).json({
      ...unauthorizedJson,
      message: 'user not found',
    })
    return
  }

  // Store user data {name, username, noTelepon, ...} to request.user
  request.user = data
  next()
}

module.exports = {
  tokenValidator,
}

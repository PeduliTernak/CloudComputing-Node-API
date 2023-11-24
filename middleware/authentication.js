require('dotenv').config()
const jwt = require('jsonwebtoken')

const tokenValidator = async (request, response, next) => {
  // Get token from Request Header
  const authorization = request.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    response.status(401).json({
      status: false,
      error: 'unauthorized access',
    })
    return
  }
  const token = authorization.replace('Bearer ', '')

  // Verify the token validity
  let decodedToken = {}
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    response.status(401).json({
      status: false,
      error: 'unauthorized access',
      type: 'Invalid token',
      message: error.message,
    })
    return
  }

  if (!decodedToken.username) {
    response.status(401).json({
      status: false,
      error: 'unauthorized access',
    })
    return
  }

  // Check if username is exist or not in the Database
  const data = (await request.db.collection('users').doc(decodedToken.username).get()).data()
  if (data === undefined) {
    response.status(409).json({
      status: false,
      error: 'username is already exist',
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

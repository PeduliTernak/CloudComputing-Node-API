const jwt = require('jsonwebtoken')

const tokenValidator = (request, response, next) => {
  const authorization = request.get('authorization')
  if (!authorization || !authorization.startsWith('Bearer ')) {
    response.status(401).json({
      status: false,
      error: 'unauthorized access',
    })
    return
  }
  const token = authorization.replace('Bearer ', '')

  let decodedToken = {}
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    response.status(401).json({
      status: false,
      error: 'Invalid token',
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
  // TODO: request.username = username from database (recheck)
  request.username = decodedToken.username
  next()
}

module.exports = {
  tokenValidator,
}

const db = require('../database/firestore')
const {
  isPasswordValid,
  isIndonesiaPhoneNumber,
} = require('../helpers/helpers')

const home = (request, response) => response.json({ status: true, message: 'OK' })

const passwordValidator = (request, response, next) => {
  const { password } = request.body

  if (!password || !isPasswordValid(password)) {
    response.status(400).json({
      status: false,
      message: 'invalid password',
    })
    return
  }

  next()
}

const noTeleponValidator = (request, response, next) => {
  const { noTelepon } = request.body

  if (!noTelepon || !isIndonesiaPhoneNumber(noTelepon)) {
    response.status(400).json({
      status: false,
      message: 'invalid phone number',
    })
    return
  }

  if (noTelepon.startsWith('+62')) {
    request.body.noTelepon = noTelepon.replace('+62', '62')
  }

  next()
}

// Abstract function for checking the existences of the some field
const checkFieldExistence = async (request, response, next, fieldName, errorMessage) => {
  const fieldValue = request.body[fieldName]

  const col = db.collection('users')
  const snapshot = await col.where(fieldName, '==', fieldValue).get()

  if (snapshot.size > 0) {
    response.status(409).json({
      status: false,
      message: errorMessage,
    })
    return
  }

  next()
}

// Usage for checking username existence
const checkUsernameExistence = async (request, response, next) => {
  await checkFieldExistence(request, response, next, 'username', 'username is already exist')
}

// Usage for checking phone number existence
const checkPhoneNumberExistence = async (request, response, next) => {
  await checkFieldExistence(request, response, next, 'noTelepon', 'noTelepon is already exist')
}

module.exports = {
  home,
  passwordValidator,
  noTeleponValidator,
  checkUsernameExistence,
  checkPhoneNumberExistence,
}

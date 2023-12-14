const db = require('../database/firestore')
const {
  isPasswordValid,
  isIndonesiaPhoneNumber,
} = require('../helpers/helpers')

const home = (_, response) => response.json({ status: true, message: 'OK' })

// Abstract function for validators
const validatorAbstractFunction = (
  request,
  response,
  next,
  fieldName,
  errorMessage,
  isFieldValid,
) => {
  const fieldValue = request.body[fieldName]

  if (!fieldValue || !isFieldValid(fieldValue)) {
    response.status(400).json({
      status: false,
      message: errorMessage,
    })
    return
  }

  next()
}

const passwordValidator = (request, response, next) => {
  validatorAbstractFunction(
    request,
    response,
    next,
    'password',
    'invalid password',
    isPasswordValid,
  )
}

const noTeleponValidator = (request, response, next) => {
  validatorAbstractFunction(
    request,
    response,
    next,
    'noTelepon',
    'invalid phone number',
    isIndonesiaPhoneNumber,
  )
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
  await checkFieldExistence(
    request,
    response,
    next,
    'username',
    'username is already exist',
  )
}

// Usage for checking phone number existence
const checkPhoneNumberExistence = async (request, response, next) => {
  await checkFieldExistence(
    request,
    response,
    next,
    'noTelepon',
    'noTelepon is already exist',
  )
}

module.exports = {
  home,
  passwordValidator,
  noTeleponValidator,
  checkUsernameExistence,
  checkPhoneNumberExistence,
}

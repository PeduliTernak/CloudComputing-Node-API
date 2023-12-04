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
      error: 'invalid password',
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
      error: 'invalid phone number',
    })
    return
  }

  if (noTelepon.startsWith('+62')) {
    request.body.noTelepon = noTelepon.replace('+62', '62')
  }

  next()
}

module.exports = {
  home,
  passwordValidator,
  noTeleponValidator,
}

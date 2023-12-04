const generateRandomString = (n) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''

  while (randomString.length < n) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomString += characters.charAt(randomIndex)
  }

  return randomString
}

const isASCIIOnly = (str) => /^[\x20-\x7E]*$/.test(str)

const isPasswordValid = (password) => password.length >= 8 && isASCIIOnly(password)

const isIndonesiaPhoneNumber = (phoneNumber) => {
  const noTelpRegex = /^62\d{9,15}$/
  const noTelpRegexWithPlus = /^\+62\d{9,15}$/
  return noTelpRegex.test(phoneNumber) || noTelpRegexWithPlus.test(phoneNumber)
}

module.exports = {
  generateRandomString,
  isASCIIOnly,
  isPasswordValid,
  isIndonesiaPhoneNumber,
}

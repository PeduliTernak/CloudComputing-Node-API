const {
  isASCIIOnly,
  isPasswordValid,
  isIndonesiaPhoneNumber,
} = require('../helpers/helpers')

describe('isASCIIOnly', () => {
  it('should return true for empty string', () => {
    const result = isASCIIOnly('')
    expect(result).toBe(true)
  })

  it('should return true for ASCII-only string', () => {
    const result = isASCIIOnly('abcdef')
    expect(result).toBe(true)
  })

  it('should return true for ASCII-only string of number', () => {
    const result = isASCIIOnly('12345')
    expect(result).toBe(true)
  })

  it('should return true for ASCII-only number', () => {
    const result = isASCIIOnly(12345)
    expect(result).toBe(true)
  })

  it('should return true for string, number, spaces, punctuation', () => {
    const result = isASCIIOnly(`Hello, world! 1234?${90}`)
    expect(result).toBe(true)
  })

  it('should return false for non-ASCII string', () => {
    const result = isASCIIOnly('Hello😊')
    expect(result).toBe(false)
  })

  it('should return false for non-ASCII string', () => {
    const result = isASCIIOnly('Hællo')
    expect(result).toBe(false)
  })

  it('should return false for string with control characters', () => {
    const result = isASCIIOnly('Hello\x01World')
    expect(result).toBe(false)
  })
})

describe('isPasswordValid', () => {
  it('should return true for a valid password', () => {
    const result = isPasswordValid('SecurePwd123')
    expect(result).toBe(true)
  })

  it('should return false for a password with length less than 8', () => {
    const result = isPasswordValid('Pwd123')
    expect(result).toBe(false)
  })

  it('should return false for a password with non-ASCII characters', () => {
    const result = isPasswordValid('Passwórd123')
    expect(result).toBe(false)
  })

  it('should return false for an empty password', () => {
    const result = isPasswordValid('')
    expect(result).toBe(false)
  })

  it('should return false for a password with ASCII control characters', () => {
    const result = isPasswordValid('Secure\x00Pwd123')
    expect(result).toBe(false)
  })

  it('should return true for a password with exactly 8 characters', () => {
    const result = isPasswordValid('Exactly8')
    expect(result).toBe(true)
  })

  it('should return true for a password with more than 8 characters', () => {
    const result = isPasswordValid('MoreThan8Characters')
    expect(result).toBe(true)
  })
})

describe('isIndonesiaPhoneNumber', () => {
  it('should return true for a valid Indonesian phone number', () => {
    const result = isIndonesiaPhoneNumber('6281234567890')
    expect(result).toBe(true)
  })

  it('should return false for a phone number without the country code', () => {
    const result = isIndonesiaPhoneNumber('081234567890')
    expect(result).toBe(false)
  })

  it('should return false for a phone number with an incorrect country code', () => {
    const result = isIndonesiaPhoneNumber('6091234567890')
    expect(result).toBe(false)
  })

  it('should return false for a phone number with alphabetic characters', () => {
    const result = isIndonesiaPhoneNumber('62abc123456')
    expect(result).toBe(false)
  })

  it('should return false for a phone number with less than 9 digits', () => {
    const result = isIndonesiaPhoneNumber('62812345')
    expect(result).toBe(false)
  })

  it('should return false for a phone number with more than 15 digits', () => {
    const result = isIndonesiaPhoneNumber('628123456789012345')
    expect(result).toBe(false)
  })
})

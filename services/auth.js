const { GoogleAuth } = require('google-auth-library')

/**
 * Get an ID token for the specified target audience
 * @param {string} targetAudience - The audience (target URL) for the ID token
 * @param {string} keyFilePath - The path to the service account key file
 * @returns {Promise<string>} - A promise that resolves to the ID token
 */
const getAuthToken = async (targetAudience, keyFilePath) => {
  const auth = new GoogleAuth({ keyFile: keyFilePath })
  const client = await auth.getIdTokenClient(targetAudience)
  const idToken = await client.idTokenProvider.fetchIdToken(targetAudience)
  return idToken
}

module.exports = getAuthToken

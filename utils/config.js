require('dotenv').config()

const PORT = process.env.PORT || 8080

const {
  NODE_ENV,
  SECRET,
} = process.env

const FIRESTORE_SERVICE_ACCOUNT_KEY_FILE = NODE_ENV === 'test'
  ? process.env.TEST_FIRESTORE_SERVICE_ACCOUNT_KEY_FILE
  : process.env.FIRESTORE_SERVICE_ACCOUNT_KEY_FILE

const PROJECT_ID = NODE_ENV === 'test'
  ? process.env.TEST_PROJECT_ID
  : process.env.PROJECT_ID

const envs = {
  PORT, PROJECT_ID, SECRET, FIRESTORE_SERVICE_ACCOUNT_KEY_FILE,
}

Object.values(envs).forEach((env) => {
  if (!env) {
    console.log('ENV required:', Object.keys(envs))
    throw new Error('Please specify all Environment Variables')
  }
})

module.exports = envs

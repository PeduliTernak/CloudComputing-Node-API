require('dotenv').config()

const PORT = process.env.PORT || 8080

const {
  NODE_ENV,
  SECRET,
  PREDICTION_MICRO_SERVICE_URL,
} = process.env

const FIRESTORE_SERVICE_ACCOUNT_KEY_FILE = NODE_ENV === 'test'
  ? process.env.TEST_FIRESTORE_SERVICE_ACCOUNT_KEY_FILE
  : process.env.FIRESTORE_SERVICE_ACCOUNT_KEY_FILE

const CLOUD_STORAGE_SERVICE_ACCOUNT_KEY_FILE = NODE_ENV === 'test'
  ? process.env.TEST_CLOUD_STORAGE_SERVICE_ACCOUNT_KEY_FILE
  : process.env.CLOUD_STORAGE_SERVICE_ACCOUNT_KEY_FILE

const CLOUD_RUN_INVOKER_SERVICE_ACCOUNT_KEY_FILE = NODE_ENV === 'test'
  ? process.env.TEST_CLOUD_RUN_INVOKER_SERVICE_ACCOUNT_KEY_FILE
  : process.env.CLOUD_RUN_INVOKER_SERVICE_ACCOUNT_KEY_FILE

const BUCKET = NODE_ENV === 'test'
  ? process.env.TEST_BUCKET
  : process.env.BUCKET

const PROJECT_ID = NODE_ENV === 'test'
  ? process.env.TEST_PROJECT_ID
  : process.env.PROJECT_ID

const envs = {
  PORT,
  SECRET,
  BUCKET,
  PROJECT_ID,
  FIRESTORE_SERVICE_ACCOUNT_KEY_FILE,
  CLOUD_STORAGE_SERVICE_ACCOUNT_KEY_FILE,
  CLOUD_RUN_INVOKER_SERVICE_ACCOUNT_KEY_FILE,
  PREDICTION_MICRO_SERVICE_URL,
}

Object.values(envs).forEach((env) => {
  if (!env) {
    console.log('ENV required:', Object.keys(envs))
    throw new Error('Please specify all Environment Variables')
  }
})

module.exports = envs

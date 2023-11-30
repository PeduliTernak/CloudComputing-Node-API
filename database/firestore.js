const Firestore = require('@google-cloud/firestore')

const { PROJECT_ID, FIRESTORE_SERVICE_ACCOUNT_KEY_FILE } = require('../utils/config')

const db = new Firestore({
  projectId: PROJECT_ID,
  keyFilename: FIRESTORE_SERVICE_ACCOUNT_KEY_FILE,
})

module.exports = db

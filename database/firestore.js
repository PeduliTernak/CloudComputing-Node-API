require('dotenv').config()
const Firestore = require('@google-cloud/firestore')

const db = new Firestore({
  projectId: process.env.FIRESTORE_PROJECT_ID,
  keyFilename: process.env.FIRESTORE_SERVICE_ACCOUNT_KEY_FILE,
})

module.exports = db

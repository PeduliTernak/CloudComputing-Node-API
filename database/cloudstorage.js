const { Storage } = require('@google-cloud/storage')

const { PROJECT_ID, CLOUD_STORAGE_SERVICE_ACCOUNT_KEY_FILE } = require('../utils/config')

const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: CLOUD_STORAGE_SERVICE_ACCOUNT_KEY_FILE,
})

module.exports = storage

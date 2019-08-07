const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL
} = require('@azure/storage-blob')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY

const ONE_MINUTE = 60 * 1000
const containerName = 'image-access'

const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY)
const pipeline = StorageURL.newPipeline(credentials)
const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline)

const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
const aborter = Aborter.timeout(30 * ONE_MINUTE)

async function getBlobNames (aborter, containerURL) {
  let response
  let marker
  let blobRes = []

  do {
    response = await containerURL.listBlobFlatSegment(aborter)
    marker = response.marker
    for (let blob of response.segment.blobItems) {
      blobRes.push(blob.name)
    }
  } while (marker)

  return blobRes
}

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.')

  if ((req.query.name && req.query.index) || (req.body.name && req.body.index)) {
    console.log(`Blobs in "${containerName}" container:`)
    const blobNames = await getBlobNames(aborter, containerURL)
    for (const name in blobNames) {
      const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, name)
      console.log(`blockBlobURL...`)
      console.log(blockBlobURL)
    }
    context.res = {
      body: blobNames.join(',')
    }
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name and image index on the query string or in the request body.'
    }
  }
}

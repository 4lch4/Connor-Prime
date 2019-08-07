const {
  Aborter,
  BlockBlobURL,
  ContainerURL,
  ServiceURL,
  SharedKeyCredential,
  StorageURL,
  uploadStreamToBlockBlob,
  uploadFileToBlockBlob
} = require('@azure/storage-blob')

const fs = require('fs')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY

const ONE_MEGABYTE = 1024 * 1024
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE
const ONE_MINUTE = 60 * 1000

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
  const containerName = 'image-access'

  const credentials = new SharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY)
  const pipeline = StorageURL.newPipeline(credentials)
  const serviceURL = new ServiceURL(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, pipeline)

  const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName)
  const aborter = Aborter.timeout(30 * ONE_MINUTE)

  console.log(`Blobs in "${containerName}" container:`)
  const blobNames = await getBlobNames(aborter, containerURL)

  context.log('JavaScript HTTP trigger function processed a request.')

  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      body: blobNames.join(',')
    }
  } else {
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body'
    }
  }
}

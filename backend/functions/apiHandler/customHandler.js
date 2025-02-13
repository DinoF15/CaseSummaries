const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3()
const { v4: uuidv4 } = require('uuid')

async function createReport (table, reportItem) {
  const nowTS = new Date().toISOString()
  reportItem.createdAt = reportItem.createdAt || nowTS
  reportItem.updatedAt = nowTS
  reportItem.PK = 'report-' + uuidv4()
  reportItem.SK = 'details'
  //  d
  // Ensure nested structures
  reportItem.organization = reportItem.organization || []
  reportItem.tac = reportItem.tac || []
  reportItem.images = reportItem.images || []

  // Ensure updatedBy field is set
  reportItem.updatedBy = reportItem.updatedBy || 'unknown' // Pass updatedBy in the event arguments

  try {
    const params = {
      TableName: table,
      Item: reportItem
    }
    await docClient.put(params).promise()
    console.log('Report created:', reportItem)
    return reportItem
  } catch (error) {
    console.error('Error creating report:', error)
    return null
  }
}

async function generatePresignedUrl(keys) {
  const bucketName = process.env.BUCKET_NAME
  const urls = []

  for (const key of keys) {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 60 * 5 // URL expires in 5 minutes
    }

    try {
      const url = await s3.getSignedUrlPromise('putObject', params)
      console.log('Pre-signed URL generated:', url)
      urls.push({ url, key })
    } catch (error) {
      console.error('Error generating pre-signed URL for key', key, ':', error)
      // Decide how you want to handle errors - skip, return null, throw, etc.
    }
  }

  return urls
}

// Upload images to a project folder in the S3 bucket
async function createImage(projectName, imageNames, imageData) {
  const bucketName = process.env.BUCKET_NAME
  console.log('imageData: ', imageData)
  console.log('imageNames: ', imageNames)

  const uploads = imageData.map(async (data, index) => {
    // Use the corresponding filename from imageNames
    const filename = imageNames[index]
    const key = `${projectName}/${filename}`
    const buffer = Buffer.from(data, 'base64')

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      // ContentType should be determined based on the file type
      // This example assumes JPEG images
      ContentType: 'image/jpeg'
    }

    return s3.putObject(params).promise()
  })

  try {
    await Promise.all(uploads)
    console.log('All images uploaded successfully')
  } catch (error) {
    console.error('Error uploading images:', error)
  }
}

// Retrieve images from a project folder in the S3 bucket
async function getImage(projectName) {
  const bucketName = process.env.BUCKET_NAME
  const params = {
    Bucket: bucketName,
    Prefix: projectName + '/'
  }

  try {
    const data = await s3.listObjectsV2(params).promise()
    const urls = await Promise.all(
      data.Contents.map(async (item) => {
        // Generate a pre-signed URL for each object
        const url = await s3.getSignedUrlPromise('getObject', {
          Bucket: bucketName,
          Key: item.Key,
          Expires: 60 * 5 // URL expires in 5 minutes
        })
        return url
      })
    )

    return urls // Returns an array of pre-signed URLs
  } catch (error) {
    console.error('Error retrieving images:', error)
    return []
  }
}
// Remove images from a project folder in the S3 bucket
async function removeImage(projectName, imageName) {
  const bucketName = process.env.BUCKET_NAME
  const key = `${projectName}/${imageName}` // Construct the key for the image to be deleted

  const params = {
    Bucket: bucketName,
    Key: key
  }

  try {
    await s3.deleteObject(params).promise()
    console.log(`Image ${imageName} deleted successfully from ${projectName}`)
    return `Image ${imageName} deleted successfully`
  } catch (error) {
    console.error(`Error deleting image ${imageName} from ${projectName}:`, error)
    return `Error deleting image ${imageName}`
  }
}
exports.handler = async (event, tables, env) => {
  // Fieldname from api call
  const apiOperation = event?.info?.fieldName
  // Retrieve table associated with this apiOperation
  const table = tables.find(table => {
    return table.apiOperations.find(operation => operation.fieldName === apiOperation) !== undefined
  })
  // const userTable = tables.find(table => {
  //   return table.tableName === 'userTable'
  // })
  // Name of the table for the request
  const tableName = table.tableName
  const type = table.apiOperations.find(operation => operation.fieldName === apiOperation).customType
  const junctionTable = table.apiOperations.find(operation => operation.fieldName === apiOperation).junctionTable
  const associatedTable = table.apiOperations.find(operation => operation.fieldName === apiOperation).associatedTable

  console.log('CUSTOM tableName:', tableName)
  console.log('CUSTOM type:', type)
  console.log('CUSTOM junctionTable:', junctionTable)
  console.log('CUSTOM associatedTable:', associatedTable)
  console.log('CUSTOM event: ', event)
  console.log('ENV FOR CUSTOM: ', env)
  switch (type) {
    case 'CLAUDE_CHAT':
      return await claudeChat(tableName, event.arguments.chatItem, tables)
    case 'CREATE_REPORT':
      return await createReport(tableName, event.arguments.dbItem)
    case 'GENERATE_PRESIGNED_URL':
      return await generatePresignedUrl(event.arguments.key)
    case 'CREATE_IMAGE':
      return await createImage(event.arguments.projectName, event.arguments.imageNames, event.arguments.imageData)
    case 'GET_IMAGE':
      return await getImage(event.arguments.projectName)
    case 'REMOVE_IMAGE':
      return await removeImage(event.arguments.projectName, event.arguments.imageName)
    default:
      return 'ERROR IN CUSTOM HANDLER'
  }
}

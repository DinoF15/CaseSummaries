/**
 * TODO:
 * 1. There need to be a filter for the list function I believe
 * 2. Test that these helper functions all work. Especially the update function.
 * 3. Check what other functions need to be added.
*/
// Help from https://www.youtube.com/watch?v=DOGadkjV7Hs
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const docClient = new AWS.DynamoDB.DocumentClient()
const ch = require('./customHandler')
const lzstring = require('lz-string')

// Get by ID
async function getReq(itemId, table) {
  const params = {
    TableName: table,
    Key: { id: itemId }
  }
  try {
    const { Item } = await docClient.get(params).promise()
    return Item
  } catch (err) {
    console.log('DynamoDB error in getReq: ', err)
    return null
  }
}

// List items in a ddb table
async function listReq(table) {
  const params = { TableName: table }
  try {
    console.log('TABLE IN LIST:', table)
    const data = await docClient.scan(params).promise()
    return data.Items
  } catch (err) {
    console.log('DynamoDB error in listReq: ', err)
    return null
  }
}

// Create item
async function createReq(item, table) {
  if (!item.id) {
    item.id = uuidv4()
  }
  const nowTS = Date.now()
  const currentTS = new Date(nowTS).toISOString()
  if (!item.createdAt) {
    item.createdAt = currentTS
  }
  if (!item.updatedAt) {
    item.updatedAt = currentTS
  }

  // Ensure nested structure
  item.organization = item.organization || []
  item.tac = item.tac || []

  item.updatedBy = item.updatedBy || 'unknown' // Pass updatedBy in the event arguments

  const params = {
    TableName: table,
    Item: item
  }

  try {
    const newItem = await docClient.put(params).promise()
    console.log('NEW ITEM: ', newItem)
    return item
  } catch (err) {
    console.log('Create DDB item error in createReq:', err)
    return null
  }
}

// Update an item
async function updateReq(item, table) {
  console.log('ITEM IN UPDATE:', item)
  console.log('TABLE IN UPDATE:', table)

  const nowTS = new Date().toISOString()
  item.updatedAt = nowTS

  // updatedBy is already set in the item, passed from the frontend

  const params = {
    TableName: table,
    Key: {
      id: item.id
    },
    UpdateExpression: 'set #updatedAt = :updatedAt, #updatedBy = :updatedBy',
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt',
      '#updatedBy': 'updatedBy'
    },
    ExpressionAttributeValues: {
      ':updatedAt': item.updatedAt,
      ':updatedBy': item.updatedBy
    },
    ReturnValues: 'UPDATED_NEW'
  }

  let prefix = ', '

  // Dynamically build out the update expression
  Object.keys(item).forEach(attribute => {
    if (attribute !== 'id' && attribute !== 'updatedAt' && attribute !== 'updatedBy') {
      const expressionName = `#${attribute}`
      const expressionValue = `:${attribute}`

      params.UpdateExpression += `${prefix}${expressionName} = ${expressionValue}`
      params.ExpressionAttributeNames[expressionName] = attribute
      params.ExpressionAttributeValues[expressionValue] = item[attribute]
      prefix = ', '
    }
  })

  console.log('Update Expression:', params.UpdateExpression)
  console.log('Expression Attribute Names:', params.ExpressionAttributeNames)
  console.log('Expression Attribute Values:', params.ExpressionAttributeValues)

  try {
    const result = await docClient.update(params).promise()
    console.log('UPDATED!', result)
    return item
  } catch (err) {
    console.log('UPDATE error in updateReq:', err)
    return null
  }
}

// Delete item
async function deleteReq(itemId, table) {
  const params = {
    TableName: table,
    Key: { id: itemId }
  }
  try {
    await docClient.delete(params).promise()
    return itemId
  } catch (err) {
    console.log('DynamoDB error in deleteReq:', err)
    return null
  }
}

/**
 * Invokes the Claude analysis Lambda function with the provided userQuery.
 *
 * @param {string} userQuery - The query to be analyzed by the Claude Lambda function.
 * @returns {Promise<Object>} - A promise that resolves to the parsed response body from the Claude Lambda function.
 * @throws {Error} - Throws an error if the invocation of the Claude Lambda function fails.
 */
async function handleClaudeAnalysis(userQuery) {
  console.log('handleClaudeAnalysis called with userQuery:', userQuery)
  const lambda = new AWS.Lambda()

  try {
    // IMPORTANT: The Python code expects `event["userQuery"]`
    const payload = { userQuery }

    console.log('Sending payload to Claude Lambda:', payload)

    const result = await lambda.invoke({
      FunctionName: process.env.CLAUDE_INVOKE_FUNCTION_NAME,
      Payload: JSON.stringify(payload)
    }).promise()

    console.log('Raw Lambda invoke result:', result)

    const parsedPayload = JSON.parse(result.Payload)
    console.log('Parsed Lambda Payload:', parsedPayload)

    if (parsedPayload.body) {
      const bodyObject = JSON.parse(parsedPayload.body)
      console.log('Body after JSON parse:', bodyObject)
      return bodyObject
    } else {
      // If there's no "body" key, just return the raw payload
      return parsedPayload
    }

  } catch (err) {
    console.error('Error invoking Claude:', err)
    throw err
  }
}

// Custom handler (if needed for special logic)
async function callCustomHandler(item, tables, env) {
  return await ch.handler(item, tables, env)
}

// Main handler
exports.handler = async (event, context) => {
  console.log('event in mainHandler:', JSON.stringify(event, null, 2))

  // Fieldname from api call
  const apiOperation = event?.info?.fieldName
  console.log('apiOperation:', apiOperation)

  // Parse config
  const tables = JSON.parse(lzstring.decompressFromEncodedURIComponent(process.env.CONFIG))
  console.log('Parsed tables from CONFIG:', tables)

  // Retrieve table associated with this apiOperation
  const table = tables.find(tbl => {
    return tbl.apiOperations.find(op => op.fieldName === apiOperation) !== undefined
  })
  console.log('Matched table from config:', table)

  if (!table) {
    // If no table entry is found for this apiOperation
    console.warn(`No table found for operation ${apiOperation}, returning null.`)
    return null
  }

  // For normal table-based ops
  const tableName = table.tableName

  // The type of api operation (GET, LIST, UPDATE, CREATE, DELETE, CUSTOM, CLAUDE, etc)
  const type = table.apiOperations.find(op => op.fieldName === apiOperation).apiReqType
  console.log('apiReqType:', type)

  // Some logs
  console.log('dbItem (if any):', event.arguments.dbItem)
  console.log('tableName:', tableName)
  console.log('Full event:', JSON.stringify(event, null, 2))

  // Choose the correct helper function based on the type
  switch (type) {
    case 'GET':
      return await getReq(event.arguments.id, tableName)

    case 'LIST':
      return await listReq(tableName)

    case 'UPDATE':
      return await updateReq(event.arguments.dbItem, tableName)

    case 'CREATE':
      return await createReq(event.arguments.dbItem, tableName)

    case 'DELETE':
      return await deleteReq(event.arguments.id, tableName)

    case 'CUSTOM':
      return await callCustomHandler(event, tables, process.env)

    case 'CLAUDE':
      // Instead of `event.arguments.query`, we use `event.arguments.userQuery`
      // or whichever name your GraphQL schema uses as an argument
      console.log('Invoking handleClaudeAnalysis with event.arguments:', event.arguments)
      return await handleClaudeAnalysis(event.arguments.userQuery)

    default:
      console.warn(`Unknown apiReqType: ${type}`)
      return null
  }
}

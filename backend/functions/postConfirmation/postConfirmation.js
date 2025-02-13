const aws = require('aws-sdk')
const ddb = new aws.DynamoDB()

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
})

exports.handler = async (event, context) => {
  console.log('event.request.userAttributes:', event.request.userAttributes)
  console.log('event.request.userAttributes.email_verified:', event.request.userAttributes.email_verified)

  // PUT BACK IN WHEN SIGN UP CODES ARE IMPLEMENTED
  // --Read the group that the user belongs to
  const paramsReadGroup = {
    UserPoolId: event.userPoolId, /* required */
    Username: event.request.userAttributes.sub /* required */
  }
  try {
    const readGroupRes = await cognitoidentityserviceprovider.adminListGroupsForUser(paramsReadGroup).promise()
    const specificGroup = readGroupRes.Groups.map(x => x.GroupName)
    console.log('Success, the group that the user belongs to has been obtained', specificGroup[0])

    if (specificGroup[0] !== 'Admin' || specificGroup[0] !== 'Supervisor' || specificGroup[0] !== 'Operator' || specificGroup[0] !== 'Guest') {
      // let codeWasDeleted = false
      // --- read group according to code in dynamo table
      const paramsScan = {
        TableName: process.env.TableName,
        ScanFilter: {
          AssignedCodes: {
            ComparisonOperator: 'CONTAINS',
            AttributeValueList: [
              { S: event.request.userAttributes.zoneinfo }
            ]
          }
        }
      }
      try {
        const scanTable = await ddb.scan(paramsScan).promise()
        console.log('scanTable:', scanTable)
        const scanTable1 = scanTable.Items.map(x => x.SignUpGroup)
        console.log('scanTable1', scanTable1)
        const group = scanTable1[0].S
        console.log('Group', group)
        console.log('Success, group has been obtained')
        const assignedCodesList = scanTable.Items.map(x => x.AssignedCodes)[0].L
        console.log('Assigned Codes: ', assignedCodesList)
        // ----------Remove used code from the table
        const scanTable2 = scanTable.Items.map(x => x.id)
        console.log('SCAN TABLE 2: ', scanTable2)
        const elementId = scanTable2.map(x => x.S)
        const indexToRemove = assignedCodesList.findIndex(i => i.S === event.request.userAttributes.zoneinfo)
        const paramsUpdate = {
          Key: {
            id: {
              S: elementId[0]
            }
          },
          ReturnValues: 'ALL_NEW',
          TableName: process.env.TableName,
          UpdateExpression: `REMOVE AssignedCodes[${indexToRemove}]`
        }

        try {
          const itemUpdated = await ddb.updateItem(paramsUpdate).promise()
          // codeWasDeleted = true
          console.log('Success, code used has been removed from table', itemUpdated)
        } catch (err) {
          console.log('Code used has not been removed from table ', err)
        }

        // ----- assign user to a group
        const groupParams = {
          GroupName: group,
          UserPoolId: event.userPoolId
        }
        const addUserParams = {
          GroupName: group,
          UserPoolId: event.userPoolId,
          Username: event.userName
        }
        /**
             * Check if the group exists; if it doesn't, create it.
             */
        try {
          await cognitoidentityserviceprovider.getGroup(groupParams).promise()
          console.log('Success, user has been assigned to a group', group)
        } catch (e) {
          await cognitoidentityserviceprovider.createGroup(groupParams).promise()
        }
        /**
             * Then, add the user to the group.
             */
        await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise()
        // }
      } catch (err) {
        console.log('Group has not been obtained', err)
        throw new Error(`The code ${event.request.userAttributes.zoneinfo} is not associated with any group`)
      }
    }
  } catch (err) {
    console.log('Print error', err)
  }

  return event
}

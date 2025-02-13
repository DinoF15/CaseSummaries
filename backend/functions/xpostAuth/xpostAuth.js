const aws = require('aws-sdk')
const ddb = new aws.DynamoDB()
const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider()

// Insert data into dynamodb table

exports.handler = async (event, context) => {
  console.log('event', event)

  if (event.request.userAttributes.sub) {
    const paramsReadGroup = {
      UserPoolId: event.userPoolId, /* required */
      Username: event.request.userAttributes.sub /* required */
    }

    try {
      const readGroupRes = await cognitoidentityserviceprovider.adminListGroupsForUser(paramsReadGroup).promise()
      console.log('readGroupRes', readGroupRes)

      const specificGroup = readGroupRes.Groups.map(x => x.GroupName)

      console.log('Success, the group that the user belongs to has been obtained', specificGroup[0])
      console.log('USER TABLE: ', process.env.USERTABLE)
      const date = new Date()
      const paramsUsertest = {
        Key: { id: { S: event.request.userAttributes.sub } },
        AttributesToGet: ['id', 'preferred_username', 'email', 'username', 'zoneinfo'],
        TableName: process.env.USERTABLE
      }

      try {
        const gettingItemtest = await ddb.getItem(paramsUsertest).promise()
        console.log('gettingItemtest', gettingItemtest)

        if (Object.keys(gettingItemtest).length === 0) {
          console.log('The user does not exist in the database')
          const paramsUser = {
            TableName: process.env.USERTABLE,
            Item: {
              id: { S: event.request.userAttributes.sub },
              __typename: { S: 'User' },
              username: { S: event.userName },
              email: { S: event.request.userAttributes.email },
              preferred_username: { S: event.request.userAttributes.preferred_username },
              registration_code: { S: event.request.userAttributes.zoneinfo },
              group: { S: specificGroup[0] },
              createdAt: { S: date.toISOString() },
              updatedAt: { S: date.toISOString() }
            }
          }
          try {
            const putItemRes = await ddb.putItem(paramsUser).promise()
            console.log('Success, the user has been inserted into the database', putItemRes)
          } catch (err) {
            console.log('Error', err)
          }
        } else {
          console.log('The user already exists in the database')
        }
      } catch (err) {
        console.log('Error', err)
      }
    } catch (err) {
      console.log('Error', err)
    }
  }
}

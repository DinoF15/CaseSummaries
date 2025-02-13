const awsConfig = {
  'aws_project_region': process.env.NEXT_PUBLIC_AMPLIFY_REGION,
  'aws_cognito_identity_pool_id': process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
  'aws_cognito_region': process.env.NEXT_PUBLIC_AMPLIFY_REGION,
  'aws_user_pools_id': process.env.NEXT_PUBLIC_USER_POOL_ID,
  'aws_user_pools_web_client_id': process.env.NEXT_PUBLIC_CLIENT_WEB_ID,
  'aws_cognito_username_attributes': [
    'EMAIL',
  ],
  'aws_cognito_signup_attributes': [
    'EMAIL',
    'PREFERRED_USERNAME',
    'ZONEINFO',
  ],
  'aws_cognito_verification_mechanisms': [
    'EMAIL',
  ],
  'aws_appsync_graphqlEndpoint': process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  'aws_appsync_region': process.env.NEXT_PUBLIC_REGION,
  'aws_appsync_authenticationType': 'AMAZON_COGNITO_USER_POOLS',
};

export default awsConfig;

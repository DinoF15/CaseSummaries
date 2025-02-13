module.exports = {
    output: 'export', // Needed for Amplify
    reactStrictMode: true,
    swcMinify: true,
    env: {
      NEXT_PUBLIC_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
      NEXT_PUBLIC_AMPLIFY_REGION: process.env.NEXT_PUBLIC_REGION,
      NEXT_PUBLIC_USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
      NEXT_PUBLIC_CLIENT_WEB_ID: process.env.NEXT_PUBLIC_CLIENT_WEB_ID,
      NEXT_PUBLIC_GRAPHQL_API_URL: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
      NEXT_PUBLIC_GRAPHQL_API_ID: process.env.NEXT_PUBLIC_GRAPHQL_API_ID,
      NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
    },
    images: {
      unoptimized: true,
    },
  };
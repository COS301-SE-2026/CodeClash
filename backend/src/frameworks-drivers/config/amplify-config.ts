import { Amplify } from 'aws-amplify'
import dotenv from 'dotenv'
dotenv.config()


const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

if (!userPoolId || !clientId) {
  console.error("Missing or Invalid cognito credentials")
}


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.COGNITO_CLIENT_ID!,
    },
  },
})



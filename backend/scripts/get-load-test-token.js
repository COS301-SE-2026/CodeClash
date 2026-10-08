const { CognitoIdentityProviderClient, AdminInitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider');
require('dotenv').config({ quiet: true });

const client = new CognitoIdentityProviderClient({ 
  region: process.env.COGNITO_REGION, 
  // from tests in backend
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

async function main() {
  const res = await client.send(new AdminInitiateAuthCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: 'k6_load_test_user',
      PASSWORD: 'LoadTest123!',
    },
  }));

  console.log(res.AuthenticationResult.IdToken); // or AccessToken, depending on what your authorizer checks
}

main().catch((e) => { console.error(e); process.exit(1); });

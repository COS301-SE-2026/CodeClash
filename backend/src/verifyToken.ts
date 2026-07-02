
import {CognitoJwtVerifier} from 'aws-jwt-verify'


const verifier = CognitoJwtVerifier.create({
    userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
    tokenUse: "id",
    clientId: `${process.env.COGNITO_CLIENT_ID}`, //client ID of app, not a userId
  });


  export const validToken = async (token: string)=> {
    
    const payload = await verifier.verify(token);

    return{
      userId: (payload.sub as string)
    };
  };
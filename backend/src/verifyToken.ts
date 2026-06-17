import app from './app';
import express from 'express';
import {createServer} from 'http';
import {WebSocketServer} from 'ws';
import {fetchAuthSession} from 'aws-amplify/auth'
import {CognitoJwtVerifier} from 'aws-jwt-verify'


const verifier = CognitoJwtVerifier.create({
    userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
    tokenUse: "id",
    clientId: `${process.env.COGNITO_CLIENT_ID}`,
  });


export interface authPayload{
    userId: string;
    username: string;
  }


  export const verifyToken = async (token: string): Promise<authPayload> => {
    
    const payload = await verifier.verify(token);

    return{
      userId: (payload.sub as string),
      username: (payload["cognito:username"] as string),
    };
  };



// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
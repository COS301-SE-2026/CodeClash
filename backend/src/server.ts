import app from './app';
import express from 'express';
import {createServer} from 'http';
import {WebSocketServer} from 'ws';
import {fetchAuthSession} from 'aws-amplify/auth'
import {CognitoJwtVerifier} from 'aws-jwt-verify'


const PORT = process.env.PORT || 3000;

const server = createServer(app);

const wss = new WebSocketServer({ noServer : true}); //makes websocket not create its own http server but just use server created above


  const verifier = CognitoJwtVerifier.create({
    userPoolId: `${process.env.COGNITO_USER_POOL_ID}`,
    tokenUse: "id",
    clientId: `${process.env.COGNITO_CLIENT_ID}`,
  });

  export interface authPayload{
    userId: number;
    username: string;
  }


// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import axios from 'axios';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// add user elo to the system 
async function fetchCognitoUsers() {
  let users = [];
  let paginationToken: string | undefined = '';

  const client = new CognitoIdentityProviderClient({});
  const input = {
    "AttributesToGet": ['sub'],
    "PaginationToken": paginationToken,
    "UserPoolId": process.env.COGNITO_USER_POOL_ID
  }

  const command = new ListUsersCommand(input);
  while (paginationToken !== undefined) {

    const response = await client.send(command);
    users.push(...response.Users || []);

    paginationToken = response.PaginationToken;
  }

  return users;
}

async function initDB() {
  const client = await pool.connect();

  try {
    const users = await fetchCognitoUsers();

    users.forEach((user) => {
      const id = user.Attributes!.find(attr => attr.Name === 'sub')?.Value
      axios.post('http:/localhost:3000/elo', JSON.stringify({ user_id: id }));
    })
  }
  finally {
    client.release
  }
}

export { pool , initDB};
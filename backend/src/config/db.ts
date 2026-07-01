import { Pool } from 'pg';
import dotenv from 'dotenv';
import { CognitoIdentityProviderClient, ListUsersCommand, ListUsersCommandInput } from '@aws-sdk/client-cognito-identity-provider';
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
  let paginationToken: string | undefined = undefined;
  let input: ListUsersCommandInput;

  const client = new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_SECRET_KEY!
    }
  });

  do {
    input = {
      "AttributesToGet": ['sub'],
      "PaginationToken": paginationToken,
      "UserPoolId": process.env.COGNITO_USER_POOL_ID
    }

    const command = new ListUsersCommand(input);

    const response = await client.send(command);
    users.push(...response.Users || []);

    paginationToken = response.PaginationToken;
  }
  while (paginationToken !== undefined)

  return users;
}

async function initDB() {
  const client = await pool.connect();
  client.query('BEGIN');

  try {
    const users = await fetchCognitoUsers();

    for (const user of users) {
      const user_id = user.Attributes!.find(attr => attr.Name === 'sub')?.Value

    //  await client.query(
    //     `INSERT INTO elo_ratings (user_id)
    //     VALUES ($1)
    //     ON CONFLICT(user_id) DO NOTHING`,
    //     [user_id]
    //   )

    console.log("Initialising user elo rating to 600");
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error setting elo');
  }
  finally {
    client.query('COMMIT');
    client.release();
  }
}

export { pool, initDB };


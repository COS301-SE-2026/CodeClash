import { Pool } from 'pg';
import dotenv from 'dotenv';
import { ListUsersCommand, ListUsersCommandInput } from '@aws-sdk/client-cognito-identity-provider';
import { cognito_identity_client } from '../services/auth.service';

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

  const client = cognito_identity_client;

  do {
    input = {
      "AttributesToGet": ['name', 'email'],
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
      const user_name = user.Attributes!.find(attr => attr.Name === 'name')?.Value;
      const email = user.Attributes!.find(attr => attr.Name === 'email')?.Value;

      await client.query(
        `INSERT INTO users (username,email)
        VALUES ($1,$2)
        ON CONFLICT (email) DO NOTHING`,
        [user_name, email]
      );

      const ids = await client.query(`SELECT user_id FROM users`);

      for (const row of ids.rows) {
        await client.query(
          `INSERT INTO elo_ratings (user_id)
        VALUES ($1)
        ON CONFLICT(user_id) DO NOTHING`,
          [row.user_id]
        )
      }
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error setting elo: ', error);
  }
  finally {
    client.query('COMMIT');
    client.release();
  }
}

export { pool, initDB };


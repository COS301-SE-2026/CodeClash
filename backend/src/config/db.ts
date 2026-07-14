import dotenv from 'dotenv';
import { fetchAllCognitoUsers } from '../controllers/user.controllers'
import { Pool } from 'pg';

dotenv.config();

const db_url = (process.env.NODE_ENV == 'test') ?
  process.env.DATABASE_TEST_URL
  : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: db_url
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// add user elo to the system 


async function initDB() {
  const client = await pool.connect();
  client.query('BEGIN');

  try {
    const users = await fetchAllCognitoUsers(['name', 'email']);

    for (const user of users) {
      const user_name = user.Attributes!.find(attr => attr.Name === 'name')?.Value;
      const email = user.Attributes!.find(attr => attr.Name === 'email')?.Value;

      await client.query(
        `INSERT INTO users (username,email,avatar_id)
        VALUES ($1,$2,$3)
        ON CONFLICT (email) DO NOTHING`,
        [user_name, email, 0]
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
      client.query('COMMIT');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Initialisation error ', error);
  }
  finally {
    client.release();
  }
}

export { pool, initDB };


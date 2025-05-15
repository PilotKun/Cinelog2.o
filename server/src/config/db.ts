import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config(); // Load environment variables from .env file

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  // ssl: {
  //   rejectUnauthorized: false, // Necessary for some cloud providers like Heroku, Render
  // },
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

// Test the connection (optional, but good for setup)
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  if (!client) {
    return console.error('Client is undefined');
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('[server-db]: Connected to PostgreSQL at', result.rows[0].now);
  });
});

export default pool; 
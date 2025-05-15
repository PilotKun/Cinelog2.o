import { Router, Request, Response, RequestHandler } from 'express';
import { query } from '../config/db';

const router = Router();

const sanitizeUsernameForTableName = (username: string): string => {
  // Replace non-alphanumeric characters with underscores
  // Convert to lowercase to ensure case-insensitivity for table names if the DB is case-sensitive
  return username.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
};

// Define a type for the request body if you expect specific properties
interface UserRequestBody {
  username: string;
}

// POST /api/users - Create or fetch user (and their table)
const handlePostUser: RequestHandler<Record<string, never>, any, UserRequestBody> = async (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string' || username.trim() === '') {
    // Use return to ensure no further code is executed in this block
    res.status(400).json({ message: 'Username is required and must be a non-empty string.' });
    return; // Explicitly return void
  }

  const tableName = `user_${sanitizeUsernameForTableName(username.trim())}`;

  try {
    // Check if the table already exists
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;
    const { rows: tableExistsRows } = await query(tableCheckQuery, [tableName]);
    const tableExists = tableExistsRows[0].exists;

    if (tableExists) {
      // For now, just confirm existence. Later, might fetch user data/preferences.
      res.status(200).json({ message: `User '${username}' already exists. Welcome back!`, tableName });
    } else {
      // Create the user-specific table
      // PRD: "title, status, rating, season, type, and other relevant metadata"
      const createUserTableQuery = `
        CREATE TABLE ${tableName} (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL, -- e.g., 'movie', 'series'
          status VARCHAR(50) NOT NULL, -- e.g., 'Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'
          rating SMALLINT, -- 1-10
          current_season SMALLINT, -- For series
          current_episode SMALLINT, -- For series
          total_episodes SMALLINT, -- For series
          release_date DATE,
          cover_image_url TEXT,
          notes TEXT,
          added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          -- Potentially more fields: director, genres (could be a separate table or array), user_specific_tags
        );
      `;
      await query(createUserTableQuery);
      
      // TODO: Add a trigger to update updated_at on row update for this table

      res.status(201).json({ message: `User '${username}' created successfully. Welcome!`, tableName });
    }
  } catch (err) {
    // Pass the error to the next error-handling middleware if you have one, or handle directly
    console.error('[ERROR] POST /api/users:', err);
    // It's good practice to send a generic error message to the client for unhandled errors
    // and log the specific error on the server for debugging.
    const errorMessage = err instanceof Error ? err.message : 'An unknown server error occurred';
    // Ensure we always return a response in the catch block too
    if (!res.headersSent) {
        res.status(500).json({ message: 'Server error while processing user.', error: errorMessage });
    }
    // Or use next(err) if you have a dedicated error handling middleware setup in Express.
  }
};

router.post('/', handlePostUser);

export default router; 
import { Router, Request, Response, RequestHandler } from 'express';
import { query } from '../config/db';
import { sanitizeUsernameForTableName } from '../utils/utils';

const router = Router();

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
      // Create the user-specific table with a more detailed schema
      const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          item_id SERIAL PRIMARY KEY,
          tmdb_id INTEGER NOT NULL,
          media_type VARCHAR(10) NOT NULL, -- 'movie' or 'tv'
          title VARCHAR(255) NOT NULL,
          poster_path VARCHAR(255),
          release_date DATE,
          user_list_type VARCHAR(50) NOT NULL, -- 'Watching', 'Completed', 'On Hold', 'Dropped', 'Plan to Watch'
          rating SMALLINT CHECK (rating >= 1 AND rating <= 10), -- 1-10
          current_season SMALLINT,
          current_episode SMALLINT,
          date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          date_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          CONSTRAINT unique_tmdb_entry_per_user UNIQUE (tmdb_id, media_type)
        );
      `;
      await query(createUserTableQuery);

      // Function to update 'date_updated' column
      const createUpdateTimestampFunctionQuery = `
        CREATE OR REPLACE FUNCTION update_timestamp_column()
        RETURNS TRIGGER AS $$
        BEGIN
           NEW.date_updated = NOW(); 
           RETURN NEW;
        END;
        $$ language 'plpgsql';
      `;
      await query(createUpdateTimestampFunctionQuery);
      
      // Trigger to update 'date_updated' on row update
      const createTriggerQuery = `
        DROP TRIGGER IF EXISTS update_${tableName}_timestamp ON ${tableName};
        CREATE TRIGGER update_${tableName}_timestamp
        BEFORE UPDATE ON ${tableName}
        FOR EACH ROW
        EXECUTE FUNCTION update_timestamp_column();
      `;
      await query(createTriggerQuery);

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
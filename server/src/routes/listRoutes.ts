import { Router, RequestHandler } from 'express';
import { query } from '../config/db';
import { sanitizeUsernameForTableName } from '../utils/utils'; // Assuming you might move sanitizeUsernameForTableName to a shared util

const router = Router();

// Interface for request body when adding/updating an item
interface ListItemBody {
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path?: string;
  release_date?: string; // YYYY-MM-DD
  user_list_type: 'Watching' | 'Completed' | 'On Hold' | 'Dropped' | 'Plan to Watch';
  rating?: number;
  current_season?: number;
  current_episode?: number;
  notes?: string;
}

// Interface for response data (can be more specific for each route if needed)
interface ListItemResponse extends ListItemBody {
  item_id: number;
  date_added: string; // Assuming it comes as string from DB
  date_updated: string; // Assuming it comes as string from DB
}

interface SuccessResponseMessage {
    message: string;
    item_id?: number;
}

interface ErrorResponseMessage {
    message: string;
}

// Helper to get user table name
const getUserTable = (username: string) => `user_${sanitizeUsernameForTableName(username)}`;

// Params type for routes with :username
interface UsernameParams { username: string; }
// Params type for routes with :username and :item_id
interface UsernameItemIdParams extends UsernameParams { item_id: string; }

// POST /api/list/:username - Add a new item to the user's list
const addListItem: RequestHandler<UsernameParams, ListItemResponse | ErrorResponseMessage, ListItemBody> = async (req, res): Promise<void> => {
  const { username } = req.params;
  const { 
    tmdb_id, media_type, title, poster_path, release_date, 
    user_list_type, rating, current_season, current_episode, notes 
  } = req.body;
  const tableName = getUserTable(username);

  if (!tmdb_id || !media_type || !title || !user_list_type) {
    res.status(400).json({ message: 'tmdb_id, media_type, title, and user_list_type are required.' });
    return;
  }

  const sql = `
    INSERT INTO ${tableName} (tmdb_id, media_type, title, poster_path, release_date, user_list_type, rating, current_season, current_episode, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const params = [
    tmdb_id, media_type, title, poster_path, release_date || null,
    user_list_type, rating || null, current_season || null, current_episode || null, notes || null
  ];

  try {
    const result = await query(sql, params);
    res.status(201).json(result.rows[0] as ListItemResponse);
  } catch (error: any) {
    console.error(`Error adding item to list for ${username}:`, error);
    if (error.code === '23505') { // Unique violation
        res.status(409).json({ message: 'This item already exists in your list.' });
        return;
    }
    res.status(500).json({ message: 'Failed to add item to list.'/*, error: error.message */ }); // Avoid sending raw error messages
  }
};

// GET /api/list/:username - Get all items from the user's list
const getListItems: RequestHandler<UsernameParams, ListItemResponse[] | ErrorResponseMessage> = async (req, res): Promise<void> => {
  const { username } = req.params;
  const tableName = getUserTable(username);
  const sql = `SELECT * FROM ${tableName} ORDER BY date_updated DESC, date_added DESC;`;

  try {
    const result = await query(sql);
    res.status(200).json(result.rows as ListItemResponse[]);
  } catch (error: any) {
    console.error(`Error fetching list for ${username}:`, error);
    res.status(500).json({ message: 'Failed to fetch list.'/*, error: error.message */ });
  }
};

// PUT /api/list/:username/:item_id - Update an existing item
const updateListItem: RequestHandler<UsernameItemIdParams, ListItemResponse | ErrorResponseMessage, Partial<ListItemBody>> = async (req, res): Promise<void> => {
  const { username, item_id } = req.params;
  const updates = req.body;
  const tableName = getUserTable(username);

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ message: 'No update fields provided.' });
    return;
  }

  const settableFields: (keyof ListItemBody)[] = ['title', 'poster_path', 'release_date', 'user_list_type', 'rating', 'current_season', 'current_episode', 'notes'];
  const setClauses: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  for (const key of settableFields) {
    if (updates[key] !== undefined) {
      setClauses.push(`${key} = $${paramIndex++}`);
      params.push(updates[key]);
    }
  }
  
  if (setClauses.length === 0) {
    res.status(400).json({ message: 'No updatable fields provided or fields are not allowed for update.' });
    return;
  }

  params.push(item_id); // For the WHERE clause
  const sql = `UPDATE ${tableName} SET ${setClauses.join(', ')}, date_updated = NOW() WHERE item_id = $${paramIndex} RETURNING *;`;

  try {
    const result = await query(sql, params);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Item not found in list.' });
      return;
    }
    res.status(200).json(result.rows[0] as ListItemResponse);
  } catch (error: any) {
    console.error(`Error updating item ${item_id} for ${username}:`, error);
    res.status(500).json({ message: 'Failed to update item.'/*, error: error.message */ });
  }
};

// DELETE /api/list/:username/:item_id - Delete an item from the list
const deleteListItem: RequestHandler<UsernameItemIdParams, SuccessResponseMessage | ErrorResponseMessage> = async (req, res): Promise<void> => {
  const { username, item_id } = req.params;
  const tableName = getUserTable(username);
  const sql = `DELETE FROM ${tableName} WHERE item_id = $1 RETURNING item_id;`;

  try {
    const result = await query(sql, [item_id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Item not found in list.' });
      return;
    }
    res.status(200).json({ message: 'Item deleted successfully.', item_id: result.rows[0].item_id });
  } catch (error: any) {
    console.error(`Error deleting item ${item_id} for ${username}:`, error);
    res.status(500).json({ message: 'Failed to delete item.'/*, error: error.message */ });
  }
};

router.post('/:username', addListItem);
router.get('/:username', getListItems);
router.put('/:username/:item_id', updateListItem);
router.delete('/:username/:item_id', deleteListItem);

export default router; 
import { Router, Request, Response, RequestHandler } from 'express';
import axios from 'axios';

const router = Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Define a type for the expected query parameters
interface TmdbSearchQuery {
  query: string;
  type: 'movie' | 'tv';
  // Add other potential query params like page, language, etc. if needed
}

// GET /api/tmdb/search
const handleTmdbSearch: RequestHandler<{}, any, any, TmdbSearchQuery> = async (req, res) => {
  const { query: searchQuery, type } = req.query;

  if (!TMDB_API_KEY) {
    res.status(500).json({ message: 'TMDB API key is not configured on the server.' });
    return;
  }

  if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
    res.status(400).json({ message: 'Search query string is required.' });
    return;
  }

  if (type !== 'movie' && type !== 'tv') {
    res.status(400).json({ message: 'Search type must be either \'movie\' or \'tv\'.' });
    return;
  }

  const endpoint = `/search/${type}`;
  const params = {
    api_key: TMDB_API_KEY,
    query: searchQuery.trim(),
    include_adult: false,
  };

  try {
    const tmdbResponse = await axios.get(`${TMDB_BASE_URL}${endpoint}`, { params });
    res.json(tmdbResponse.data);
  } catch (error) {
    console.error('[ERROR] GET /api/tmdb/search:', error instanceof axios.AxiosError ? error.response?.data || error.message : error);
    const statusCode = error instanceof axios.AxiosError && error.response ? error.response.status : 500;
    const message = error instanceof axios.AxiosError && error.response?.data?.status_message 
                    ? `TMDB API Error: ${error.response.data.status_message}` 
                    : 'Failed to fetch data from TMDB.';
    if (!res.headersSent) {
        res.status(statusCode).json({ message });
    }
  }
};

router.get('/search', handleTmdbSearch);

// TODO: Add more TMDB routes as needed (e.g., get details by ID, get popular, etc.)

export default router; 
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import pool from './config/db';
import userRoutes from './routes/userRoutes';
import tmdbRoutes from './routes/tmdbRoutes';
import listRoutes from './routes/listRoutes';

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server is running!');
});

app.use('/api/users', userRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/list', listRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
}); 
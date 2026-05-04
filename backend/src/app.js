import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from '../config/db.js';
import authRoutes from './routes/auth.routes.js';
import gearRoutes from './routes/gear.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import crawlRoutes from './routes/crawl.routes.js';

import { startGearVNCron } from './jobs/crawlerGearVN.js';
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'checkgear-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/gears', gearRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/crawl', crawlRoutes);

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const start = async () => {
  await connectDB();
  startGearVNCron();

  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

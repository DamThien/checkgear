import 'dotenv/config';
import express from 'express';
import connectDB from '../config/db.js';
import { crawlGearVNCpu } from './crawlers/gearvn.cpu.crawler.js';

const app = express();

await connectDB();

app.listen(3000, async () => {
  console.log('Server running on port 3000');
  await crawlGearVNCpu(); // test thủ công
});

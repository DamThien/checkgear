import cron from 'node-cron';
import { crawlGearVNCpu } from '../crawlers/gearvn.cpu.crawler.js';

export const startGearVNCron = () => {
  cron.schedule('0 0 * * *', async () => {
    // 0h sáng mỗi ngày
    await crawlGearVNCpu();
  });
};

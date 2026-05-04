import cron from 'node-cron';
import { crawlGearVN } from '../crawlers/gearvn.crawler.js';
import { syncExternalPrices } from '../controllers/crawl.controller.js';

// Configuration options
const CRON_OPTIONS = {
  schedule: '0 0 * * *', // Run at 00:00 daily (Vietnam timezone)
  timezone: 'Asia/Ho_Chi_Minh',
};

// Job state management
let isRunning = false;
let lastRun = null;
let lastError = null;

/**
 * Crawl job handler with error handling and logging
 * @async
 * @returns {Promise<void>}
 */
const runCrawlJob = async () => {
  // Prevent concurrent executions
  if (isRunning) {
    console.warn('[CrawlerGearVN] Previous crawl still running, skipping this iteration');
    return;
  }

  const startTime = Date.now();
  isRunning = true;
  lastError = null;

  console.log('[CrawlerGearVN] Starting crawl job...');

  try {
    // Run crawlers sequentially for better resource management
    await crawlGearVN();
    await syncExternalPrices();

    const duration = Date.now() - startTime;
    lastRun = new Date();
    console.log(`[CrawlerGearVN] Crawl completed successfully in ${duration}ms`);
  } catch (error) {
    lastError = error;
    console.error('[CrawlerGearVN] Crawl failed:', error.message);
    // Consider implementing retry logic or notifications here
  } finally {
    isRunning = false;
  }
};

/**
 * Start the GearVN crawl cron job
 * @returns {void}
 */
export const startGearVNCron = () => {
  // Validate cron expression
  if (!cron.validate(CRON_OPTIONS.schedule)) {
    console.error('[CrawlerGearVN] Invalid cron expression');
    return;
  }

  console.log(`[CrawlerGearVN] Scheduled cron job: ${CRON_OPTIONS.schedule}`);

  cron.schedule(CRON_OPTIONS.schedule, runCrawlJob, {
    scheduled: true,
    timezone: CRON_OPTIONS.timezone,
  });

  // Run immediately on startup (optional - remove if not needed)
  runCrawlJob();
};

/**
 * Get crawl job status
 * @returns {Object} Status information
 */
export const getCrawlStatus = () => ({
  isRunning,
  lastRun,
  lastError: lastError?.message,
});

/**
 * Manual trigger for crawl job (useful for testing or manual runs)
 * @returns {Promise<void>}
 */
export const triggerCrawl = () => runCrawlJob();

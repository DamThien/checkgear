import { Router } from 'express';
import { listCrawledProducts, searchGearVN } from '../controllers/crawl.controller.js';

const router = Router();

router.get('/products', listCrawledProducts);
router.get('/search', searchGearVN);

export default router;


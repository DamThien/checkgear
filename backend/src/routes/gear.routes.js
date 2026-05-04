import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import {
  createGear,
  deleteGear,
  getGearPriceHistory,
  listGears,
  updateGear,
} from '../controllers/gear.controller.js';

const router = Router();

router.use(auth);
router.post('/', createGear);
router.get('/', listGears);
router.patch('/:id', updateGear);
router.delete('/:id', deleteGear);
router.get('/:id/price-history', getGearPriceHistory);

export default router;


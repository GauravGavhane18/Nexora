import express from 'express';
import {
  getAuctions,
  getAuction,
  createAuction,
  placeBid,
  watchAuction,
  getMyBids,
  getMyAuctions
} from '../controllers/auctionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAuctions);
router.get('/:id', getAuction);

router.use(protect);

router.post('/:id/bid', placeBid);
router.post('/:id/watch', watchAuction);
router.get('/my/bids', getMyBids);

// Seller routes
router.use(authorize('seller', 'admin'));
router.post('/', createAuction);
router.get('/my/auctions', getMyAuctions);

export default router;

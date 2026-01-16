import express from 'express';
import {
  getTickets,
  getTicket,
  createTicket,
  addMessage,
  updateTicketStatus,
  assignTicket,
  rateTicket,
  getMyTickets
} from '../controllers/supportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/my-tickets', getMyTickets);
router.post('/', createTicket);
router.get('/:id', getTicket);
router.post('/:id/messages', addMessage);
router.post('/:id/rate', rateTicket);

// Support/Admin routes
router.use(authorize('admin', 'support'));
router.get('/', getTickets);
router.put('/:id/status', updateTicketStatus);
router.put('/:id/assign', assignTicket);

export default router;

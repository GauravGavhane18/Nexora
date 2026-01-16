import express from 'express';
import {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  markAsRead,
  archiveConversation
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversation);
router.post('/:id/messages', sendMessage);
router.put('/:id/read', markAsRead);
router.put('/:id/archive', archiveConversation);

export default router;

import express from 'express';

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Product routes working', products: [] });
});

export default router;
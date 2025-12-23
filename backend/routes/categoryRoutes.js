import express from 'express';

const router = express.Router();

// Placeholder routes - to be implemented
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Category routes working', categories: [] });
});

export default router;
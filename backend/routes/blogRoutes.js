import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  addComment,
  approveComment
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlog);

router.use(protect);

router.post('/:id/like', likeBlog);
router.post('/:id/comments', addComment);

// Admin/Author routes
router.use(authorize('admin', 'author'));
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);
router.put('/:id/comments/:commentId/approve', approveComment);

export default router;

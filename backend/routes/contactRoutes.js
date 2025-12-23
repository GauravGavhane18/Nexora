import express from 'express'
import { body } from 'express-validator'
import {
  submitContactForm,
  getContactMessages,
  updateContactMessage,
  deleteContactMessage
} from '../controllers/contactController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
]

// Public routes
router.post('/', contactValidation, submitContactForm)

// Admin routes
router.use(protect) // All routes below require authentication
router.get('/', authorize('admin'), getContactMessages)
router.put('/:id', authorize('admin'), updateContactMessage)
router.delete('/:id', authorize('admin'), deleteContactMessage)

export default router
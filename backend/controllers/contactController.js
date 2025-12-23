import Contact from '../models/Contact.js'
import { validationResult } from 'express-validator'

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { name, email, subject, message } = req.body

    // Create new contact entry
    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    })

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    })

  } catch (error) {
    console.error('Contact form submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    })
  }
}

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const status = req.query.status
    const priority = req.query.priority

    // Build query
    let query = {}
    if (status) query.status = status
    if (priority) query.priority = priority

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('respondedBy', 'firstName lastName email')

    const total = await Contact.countDocuments(query)

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get contact messages error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Update contact message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContactMessage = async (req, res) => {
  try {
    const { status, priority, response } = req.body
    const contactId = req.params.id

    const updateData = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (response) {
      updateData.response = response
      updateData.respondedAt = new Date()
      updateData.respondedBy = req.user.id
    }

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true, runValidators: true }
    ).populate('respondedBy', 'firstName lastName email')

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      })
    }

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: contact
    })

  } catch (error) {
    console.error('Update contact message error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      })
    }

    await contact.deleteOne()

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    })

  } catch (error) {
    console.error('Delete contact message error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}
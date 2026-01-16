import SupportTicket from '../models/SupportTicket.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all tickets (Admin/Support)
// @route   GET /api/v1/support
// @access  Private/Admin
export const getTickets = asyncHandler(async (req, res) => {
  const { status, category, priority, assignedTo } = req.query;
  
  const query = {};
  
  if (status) query.status = status;
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  
  const tickets = await SupportTicket.find(query)
    .populate('user', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});

// @desc    Get user's tickets
// @route   GET /api/v1/support/my-tickets
// @access  Private
export const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await SupportTicket.find({ user: req.user._id })
    .populate('assignedTo', 'firstName lastName')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});

// @desc    Get single ticket
// @route   GET /api/v1/support/:id
// @access  Private
export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate('user', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName')
    .populate('messages.sender', 'firstName lastName')
    .populate('relatedOrder', 'orderNumber')
    .populate('relatedProduct', 'name images');
  
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  
  // Check authorization
  if (ticket.user._id.toString() !== req.user._id.toString() && 
      !['admin', 'support'].includes(req.user.role)) {
    res.status(403);
    throw new Error('Not authorized');
  }
  
  res.json({
    success: true,
    data: ticket
  });
});

// @desc    Create ticket
// @route   POST /api/v1/support
// @access  Private
export const createTicket = asyncHandler(async (req, res) => {
  const { subject, category, priority, message, relatedOrder, relatedProduct } = req.body;
  
  const ticket = await SupportTicket.create({
    user: req.user._id,
    subject,
    category,
    priority: priority || 'medium',
    relatedOrder,
    relatedProduct,
    messages: [{
      sender: req.user._id,
      senderType: 'customer',
      content: message
    }]
  });
  
  res.status(201).json({
    success: true,
    data: ticket
  });
});

// @desc    Add message to ticket
// @route   POST /api/v1/support/:id/messages
// @access  Private
export const addMessage = asyncHandler(async (req, res) => {
  const { content, attachments, isInternal } = req.body;
  
  const ticket = await SupportTicket.findById(req.params.id);
  
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  
  const senderType = ['admin', 'support'].includes(req.user.role) ? 'support' : 'customer';
  
  await ticket.addMessage(req.user._id, senderType, content, attachments);
  
  // Emit socket event
  if (req.io) {
    const recipientId = senderType === 'support' ? ticket.user : ticket.assignedTo;
    if (recipientId) {
      req.io.to(`user_${recipientId}`).emit('support_reply', {
        ticketId: ticket._id,
        message: content
      });
    }
  }
  
  res.json({
    success: true,
    data: ticket
  });
});

// @desc    Update ticket status
// @route   PUT /api/v1/support/:id/status
// @access  Private/Admin
export const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  const ticket = await SupportTicket.findById(req.params.id);
  
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  
  await ticket.updateStatus(status);
  
  res.json({
    success: true,
    data: ticket
  });
});

// @desc    Assign ticket
// @route   PUT /api/v1/support/:id/assign
// @access  Private/Admin
export const assignTicket = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body;
  
  const ticket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    { assignedTo },
    { new: true }
  );
  
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  
  res.json({
    success: true,
    data: ticket
  });
});

// @desc    Rate ticket
// @route   POST /api/v1/support/:id/rate
// @access  Private
export const rateTicket = asyncHandler(async (req, res) => {
  const { score, feedback } = req.body;
  
  const ticket = await SupportTicket.findById(req.params.id);
  
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }
  
  if (ticket.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  
  ticket.rating = {
    score,
    feedback,
    ratedAt: new Date()
  };
  
  await ticket.save();
  
  res.json({
    success: true,
    message: 'Thank you for your feedback',
    data: ticket
  });
});

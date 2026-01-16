import { Conversation, Message } from '../models/Message.js';
import asyncHandler from 'express-async-handler';

// @desc    Get user conversations
// @route   GET /api/v1/messages
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
    archivedBy: { $ne: req.user._id }
  })
  .populate('participants', 'firstName lastName avatar')
  .populate('lastMessage.sender', 'firstName lastName')
  .populate('relatedProduct', 'name images')
  .sort({ 'lastMessage.timestamp': -1 });
  
  res.json({
    success: true,
    count: conversations.length,
    data: conversations
  });
});

// @desc    Get single conversation
// @route   GET /api/v1/messages/:id
// @access  Private
export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate('participants', 'firstName lastName avatar')
    .populate('relatedProduct', 'name images basePrice')
    .populate('relatedOrder', 'orderNumber');
  
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  
  // Check if user is participant
  if (!conversation.participants.some(p => p._id.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to view this conversation');
  }
  
  // Get messages
  const messages = await Message.find({ conversation: req.params.id })
    .populate('sender', 'firstName lastName avatar')
    .sort({ createdAt: 1 });
  
  res.json({
    success: true,
    data: {
      conversation,
      messages
    }
  });
});

// @desc    Create conversation
// @route   POST /api/v1/messages
// @access  Private
export const createConversation = asyncHandler(async (req, res) => {
  const { participants, subject, relatedProduct, relatedOrder, type } = req.body;
  
  // Check if conversation already exists
  const existing = await Conversation.findOne({
    participants: { $all: [req.user._id, ...participants] },
    relatedProduct: relatedProduct || null
  });
  
  if (existing) {
    return res.json({
      success: true,
      data: existing
    });
  }
  
  const conversation = await Conversation.create({
    participants: [req.user._id, ...participants],
    subject,
    relatedProduct,
    relatedOrder,
    type: type || 'buyer-seller'
  });
  
  res.status(201).json({
    success: true,
    data: conversation
  });
});

// @desc    Send message
// @route   POST /api/v1/messages/:id/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, attachments } = req.body;
  
  const conversation = await Conversation.findById(req.params.id);
  
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  
  // Check if user is participant
  if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized');
  }
  
  const message = await Message.create({
    conversation: req.params.id,
    sender: req.user._id,
    content,
    attachments: attachments || []
  });
  
  // Update unread count for other participants
  conversation.participants.forEach(participantId => {
    if (participantId.toString() !== req.user._id.toString()) {
      const currentCount = conversation.unreadCount.get(participantId.toString()) || 0;
      conversation.unreadCount.set(participantId.toString(), currentCount + 1);
    }
  });
  
  await conversation.save();
  
  // Emit socket event
  if (req.io) {
    conversation.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        req.io.to(`user_${participantId}`).emit('new_message', {
          conversationId: conversation._id,
          message
        });
      }
    });
  }
  
  res.status(201).json({
    success: true,
    data: message
  });
});

// @desc    Mark conversation as read
// @route   PUT /api/v1/messages/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  
  conversation.unreadCount.set(req.user._id.toString(), 0);
  await conversation.save();
  
  res.json({
    success: true,
    message: 'Marked as read'
  });
});

// @desc    Archive conversation
// @route   PUT /api/v1/messages/:id/archive
// @access  Private
export const archiveConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  
  if (!conversation.archivedBy.includes(req.user._id)) {
    conversation.archivedBy.push(req.user._id);
    await conversation.save();
  }
  
  res.json({
    success: true,
    message: 'Conversation archived'
  });
});

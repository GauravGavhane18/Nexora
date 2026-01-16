import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['order', 'product', 'payment', 'account', 'technical', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'waiting-customer', 'resolved', 'closed'],
    default: 'open'
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderType: {
      type: String,
      enum: ['customer', 'support', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    attachments: [{
      filename: String,
      url: String,
      size: Number
    }],
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  tags: [String],
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  },
  resolvedAt: Date,
  closedAt: Date,
  firstResponseTime: Number, // in minutes
  resolutionTime: Number // in minutes
}, {
  timestamps: true
});

// Pre-save middleware to generate ticket number
supportTicketSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.ticketNumber = `TKT-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Method to add message
supportTicketSchema.methods.addMessage = function (sender, senderType, content, attachments = []) {
  this.messages.push({
    sender,
    senderType,
    content,
    attachments
  });

  // Calculate first response time if this is the first support response
  if (senderType === 'support' && !this.firstResponseTime) {
    const firstMessage = this.messages[0];
    this.firstResponseTime = Math.floor((Date.now() - firstMessage.createdAt) / 60000);
  }

  return this.save();
};

// Method to update status
supportTicketSchema.methods.updateStatus = function (newStatus, assignedTo) {
  this.status = newStatus;

  if (assignedTo) {
    this.assignedTo = assignedTo;
  }

  if (newStatus === 'resolved') {
    this.resolvedAt = new Date();
    const firstMessage = this.messages[0];
    this.resolutionTime = Math.floor((Date.now() - firstMessage.createdAt) / 60000);
  } else if (newStatus === 'closed') {
    this.closedAt = new Date();
  }

  return this.save();
};

// Indexes

supportTicketSchema.index({ user: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ assignedTo: 1 });
supportTicketSchema.index({ category: 1 });

export default mongoose.model('SupportTicket', supportTicketSchema);

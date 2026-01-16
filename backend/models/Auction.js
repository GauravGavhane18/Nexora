import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: String,
  startingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  reservePrice: {
    type: Number,
    min: 0
  },
  currentBid: {
    type: Number,
    default: 0
  },
  bidIncrement: {
    type: Number,
    default: 10,
    min: 1
  },
  bids: [{
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isAutoBid: {
      type: Boolean,
      default: false
    }
  }],
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'ended', 'cancelled'],
    default: 'scheduled'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  winningBid: Number,
  autoBidders: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    maxBid: Number
  }],
  viewsCount: {
    type: Number,
    default: 0
  },
  watchers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for time remaining
auctionSchema.virtual('timeRemaining').get(function() {
  if (this.status !== 'active') return 0;
  return Math.max(0, this.endTime - Date.now());
});

// Method to place bid
auctionSchema.methods.placeBid = async function(bidderId, amount, isAutoBid = false) {
  if (this.status !== 'active') {
    throw new Error('Auction is not active');
  }
  
  if (amount < this.currentBid + this.bidIncrement) {
    throw new Error(`Bid must be at least ${this.currentBid + this.bidIncrement}`);
  }
  
  this.bids.push({
    bidder: bidderId,
    amount,
    isAutoBid
  });
  
  this.currentBid = amount;
  
  return this.save();
};

// Method to end auction
auctionSchema.methods.endAuction = async function() {
  if (this.bids.length > 0) {
    const winningBid = this.bids[this.bids.length - 1];
    this.winner = winningBid.bidder;
    this.winningBid = winningBid.amount;
  }
  
  this.status = 'ended';
  return this.save();
};

// Indexes
auctionSchema.index({ seller: 1 });
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ 'bids.bidder': 1 });

export default mongoose.model('Auction', auctionSchema);

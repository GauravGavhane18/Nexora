import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const setupSocketIO = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 User ${socket.userId} connected`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Join admin users to admin room
    if (socket.userRole === 'admin') {
      socket.join('admin_room');
    }

    // Join sellers to seller room
    if (socket.userRole === 'seller') {
      socket.join('seller_room');
    }

    // Handle order status updates
    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
    });

    // Handle inventory updates
    socket.on('join_product_room', (productId) => {
      socket.join(`product_${productId}`);
    });

    // Handle auction updates
    socket.on('join_auction_room', (auctionId) => {
      socket.join(`auction_${auctionId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User ${socket.userId} disconnected`);
    });
  });

  // Helper functions for emitting events
  global.socketEmit = {
    // Emit to specific user
    toUser: (userId, event, data) => {
      io.to(`user_${userId}`).emit(event, data);
    },

    // Emit to all admins
    toAdmins: (event, data) => {
      io.to('admin_room').emit(event, data);
    },

    // Emit to all sellers
    toSellers: (event, data) => {
      io.to('seller_room').emit(event, data);
    },

    // Emit order updates
    orderUpdate: (orderId, data) => {
      io.to(`order_${orderId}`).emit('order_status_update', data);
    },

    // Emit inventory updates
    inventoryUpdate: (productId, data) => {
      io.to(`product_${productId}`).emit('inventory_update', data);
    },

    // Emit to all connected users
    toAll: (event, data) => {
      io.emit(event, data);
    }
  };
};
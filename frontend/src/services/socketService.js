import { io } from 'socket.io-client'
import toast from 'react-hot-toast'

let socket = null

export const initializeSocket = (token) => {
  if (socket) {
    socket.disconnect()
  }

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
    auth: {
      token: token
    },
    transports: ['websocket', 'polling']
  })

  socket.on('connect', () => {
    console.log('🔌 Connected to server')
  })

  socket.on('disconnect', () => {
    console.log('🔌 Disconnected from server')
  })

  socket.on('connect_error', (error) => {
    console.error('🔌 Connection error:', error)
  })

  // Order status updates
  socket.on('order_status_update', (data) => {
    toast.success(`Order ${data.orderNumber} status updated to ${data.status}`)
    // Dispatch action to update order in store if needed
  })

  // Inventory updates
  socket.on('inventory_update', (data) => {
    console.log('📦 Inventory updated:', data)
    // Dispatch action to update product inventory in store
  })

  // Admin notifications
  socket.on('admin_notification', (data) => {
    // Check user role from localStorage or pass it as parameter
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user?.role === 'admin') {
        toast(data.message, {
          icon: '🔔',
          duration: 6000
        })
      }
    }
  })

  // Seller notifications
  socket.on('seller_notification', (data) => {
    // Check user role from localStorage or pass it as parameter
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      if (user?.role === 'seller') {
        toast(data.message, {
          icon: '💼',
          duration: 6000
        })
      }
    }
  })

  // General notifications
  socket.on('notification', (data) => {
    toast(data.message, {
      icon: data.icon || '📢',
      duration: data.duration || 4000
    })
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

// Socket event emitters
export const joinOrderRoom = (orderId) => {
  if (socket) {
    socket.emit('join_order_room', orderId)
  }
}

export const joinProductRoom = (productId) => {
  if (socket) {
    socket.emit('join_product_room', productId)
  }
}

export const joinAuctionRoom = (auctionId) => {
  if (socket) {
    socket.emit('join_auction_room', auctionId)
  }
}

export const leaveRoom = (roomName) => {
  if (socket) {
    socket.emit('leave_room', roomName)
  }
}

// Custom event listeners
export const onOrderUpdate = (callback) => {
  if (socket) {
    socket.on('order_status_update', callback)
  }
}

export const onInventoryUpdate = (callback) => {
  if (socket) {
    socket.on('inventory_update', callback)
  }
}

export const offOrderUpdate = (callback) => {
  if (socket) {
    socket.off('order_status_update', callback)
  }
}

export const offInventoryUpdate = (callback) => {
  if (socket) {
    socket.off('inventory_update', callback)
  }
}
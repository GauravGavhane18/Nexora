import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(` MongoDB Connected: ${conn.connection.host}`);

    // Create indexes for better performance
    if (conn.connection.db) {
      await createIndexes(conn.connection.db);
    }
  } catch (error) {
    console.error(` Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async (db) => {
  try {
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });

    // Product indexes
    await db.collection('products').createIndex({ name: 'text', description: 'text', tags: 'text' });
    await db.collection('products').createIndex({ category: 1, subCategory: 1 });
    await db.collection('products').createIndex({ seller: 1 });
    await db.collection('products').createIndex({ isActive: 1, isDeleted: 1 });

    // Order indexes
    await db.collection('orders').createIndex({ user: 1 });
    await db.collection('orders').createIndex({ orderStatus: 1 });
    await db.collection('orders').createIndex({ createdAt: -1 });

    // Subscription indexes
    await db.collection('subscriptions').createIndex({ user: 1 });
    await db.collection('subscriptions').createIndex({ status: 1 });

    console.log(' Database indexes created successfully');
  } catch (error) {
    console.error(' Error creating indexes:', error.message);
  }
};

export default connectDB;
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);

    // Create indexes for better performance
    await createIndexes();
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // User indexes
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ role: 1 });
    
    // Product indexes
    await mongoose.connection.db.collection('products').createIndex({ name: 'text', description: 'text' });
    await mongoose.connection.db.collection('products').createIndex({ category: 1, subCategory: 1 });
    await mongoose.connection.db.collection('products').createIndex({ seller: 1 });
    await mongoose.connection.db.collection('products').createIndex({ isActive: 1, isDeleted: 1 });
    
    // Order indexes
    await mongoose.connection.db.collection('orders').createIndex({ user: 1 });
    await mongoose.connection.db.collection('orders').createIndex({ orderStatus: 1 });
    await mongoose.connection.db.collection('orders').createIndex({ createdAt: -1 });
    
    // Subscription indexes
    await mongoose.connection.db.collection('subscriptions').createIndex({ user: 1 });
    await mongoose.connection.db.collection('subscriptions').createIndex({ status: 1 });
    
    console.log('📈 Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

export default connectDB;
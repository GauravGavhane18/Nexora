import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 MongoDB Connected');

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('🗑️  Cleared existing users');

    // Create test users
    const users = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'buyer@test.com',
        password: 'Test@123',
        role: 'user',
        isEmailVerified: true,
        isActive: true
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'seller@test.com',
        password: 'Test@123',
        role: 'seller',
        isEmailVerified: true,
        isActive: true,
        sellerProfile: {
          businessName: 'Jane\'s Store',
          businessType: 'individual',
          isApproved: true,
          approvedAt: new Date(),
          commission: 10
        }
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        password: 'Test@123',
        role: 'admin',
        isEmailVerified: true,
        isActive: true
      }
    ];

    // Check if users already exist
    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
      } else {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Customer Login:');
    console.log('   Email: buyer@test.com');
    console.log('   Password: Test@123');
    console.log('');
    console.log('💼 Seller Login:');
    console.log('   Email: seller@test.com');
    console.log('   Password: Test@123');
    console.log('');
    console.log('🔧 Admin Login:');
    console.log('   Email: admin@test.com');
    console.log('   Password: Test@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();

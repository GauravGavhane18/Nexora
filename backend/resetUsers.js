import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 MongoDB Connected');

    // Delete all users
    await User.deleteMany({});
    console.log('🗑️  Deleted all existing users');

    // Create new test users
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

    for (const userData of users) {
      await User.create(userData);
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }

    console.log('\n🎉 Reset completed successfully!');
    console.log('\n📋 NEW Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: buyer@test.com OR seller@test.com OR admin@test.com');
    console.log('Password: Test@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

resetUsers();

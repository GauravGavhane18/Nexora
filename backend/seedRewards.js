import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Reward } from './models/LoyaltyProgram.js';
import connectDB from './config/database.js';

dotenv.config();

const rewards = [
  {
    name: '$5 Off Your Next Purchase',
    description: 'Get $5 discount on orders over $50',
    type: 'discount',
    value: 5,
    valueType: 'fixed',
    pointsCost: 500,
    minTier: 'bronze',
    stock: -1,
    terms: 'Valid on orders over $50. Cannot be combined with other offers.',
    isActive: true
  },
  {
    name: '10% Off Coupon',
    description: 'Save 10% on your entire order',
    type: 'discount',
    value: 10,
    valueType: 'percentage',
    pointsCost: 1000,
    minTier: 'silver',
    stock: -1,
    terms: 'Valid on all products. Maximum discount $50.',
    isActive: true
  },
  {
    name: 'Free Shipping',
    description: 'Free shipping on your next order',
    type: 'free-shipping',
    value: 0,
    valueType: 'fixed',
    pointsCost: 300,
    minTier: 'bronze',
    stock: -1,
    terms: 'Valid for one order. No minimum purchase required.',
    isActive: true
  },
  {
    name: '$20 Off Premium Products',
    description: 'Get $20 off on premium category products',
    type: 'discount',
    value: 20,
    valueType: 'fixed',
    pointsCost: 2000,
    minTier: 'gold',
    stock: -1,
    terms: 'Valid on premium products only. Minimum purchase $100.',
    isActive: true
  },
  {
    name: '25% Off Everything',
    description: 'Exclusive 25% discount on all products',
    type: 'discount',
    value: 25,
    valueType: 'percentage',
    pointsCost: 5000,
    minTier: 'platinum',
    stock: 100,
    terms: 'Limited quantity. Valid for 30 days from redemption.',
    isActive: true
  },
  {
    name: '$10 Cashback',
    description: 'Get $10 cashback to your wallet',
    type: 'cashback',
    value: 10,
    valueType: 'fixed',
    pointsCost: 1000,
    minTier: 'silver',
    stock: -1,
    terms: 'Cashback will be added to your wallet within 24 hours.',
    isActive: true
  },
  {
    name: 'Birthday Special - $15 Off',
    description: 'Special birthday discount',
    type: 'discount',
    value: 15,
    valueType: 'fixed',
    pointsCost: 0,
    minTier: 'bronze',
    stock: -1,
    terms: 'Available during your birthday month. Auto-applied.',
    isActive: true
  },
  {
    name: 'VIP Free Shipping (1 Year)',
    description: 'Free shipping on all orders for 1 year',
    type: 'free-shipping',
    value: 0,
    valueType: 'fixed',
    pointsCost: 10000,
    minTier: 'platinum',
    stock: 50,
    terms: 'Valid for 365 days from redemption. All orders included.',
    isActive: true
  }
];

const seedRewards = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing rewards...');
    await Reward.deleteMany({});
    
    console.log('🌱 Seeding rewards...');
    const createdRewards = await Reward.insertMany(rewards);
    
    console.log(`✅ Successfully seeded ${createdRewards.length} rewards`);
    console.log('\nRewards by tier:');
    console.log('Bronze:', createdRewards.filter(r => r.minTier === 'bronze').length);
    console.log('Silver:', createdRewards.filter(r => r.minTier === 'silver').length);
    console.log('Gold:', createdRewards.filter(r => r.minTier === 'gold').length);
    console.log('Platinum:', createdRewards.filter(r => r.minTier === 'platinum').length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding rewards:', error);
    process.exit(1);
  }
};

seedRewards();

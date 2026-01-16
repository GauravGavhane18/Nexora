import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductBundle from './models/ProductBundle.js';
import Product from './models/Product.js';
import User from './models/User.js';
import connectDB from './config/database.js';

dotenv.config();

const seedBundles = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing bundles...');
    await ProductBundle.deleteMany({});
    
    // Get a seller user
    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.error('❌ No seller found. Please seed users first.');
      process.exit(1);
    }
    
    // Get some products
    const products = await Product.find({ seller: seller._id }).limit(10);
    if (products.length < 3) {
      console.error('❌ Not enough products found. Please seed products first.');
      process.exit(1);
    }
    
    const bundles = [
      {
        name: 'Starter Bundle - Essential Tools',
        description: 'Everything you need to get started. Includes 3 essential products at a great price.',
        products: [
          { product: products[0]._id, quantity: 1 },
          { product: products[1]._id, quantity: 1 },
          { product: products[2]._id, quantity: 1 }
        ],
        pricing: {
          originalPrice: products[0].basePrice + products[1].basePrice + products[2].basePrice,
          bundlePrice: (products[0].basePrice + products[1].basePrice + products[2].basePrice) * 0.8
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            alt: 'Starter Bundle'
          }
        ],
        seller: seller._id,
        status: 'active',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        stock: {
          quantity: 50,
          sold: 0
        }
      },
      {
        name: 'Professional Bundle - Complete Set',
        description: 'Professional-grade bundle with premium products. Perfect for serious users.',
        products: [
          { product: products[3]._id, quantity: 1 },
          { product: products[4]._id, quantity: 2 },
          { product: products[5]._id, quantity: 1 }
        ],
        pricing: {
          originalPrice: products[3].basePrice + (products[4].basePrice * 2) + products[5].basePrice,
          bundlePrice: (products[3].basePrice + (products[4].basePrice * 2) + products[5].basePrice) * 0.75
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            alt: 'Professional Bundle'
          }
        ],
        seller: seller._id,
        status: 'active',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        stock: {
          quantity: 30,
          sold: 0
        }
      },
      {
        name: 'Holiday Special Bundle',
        description: 'Limited time holiday bundle with amazing savings. Get 30% off!',
        products: [
          { product: products[6]._id, quantity: 1 },
          { product: products[7]._id, quantity: 1 }
        ],
        pricing: {
          originalPrice: products[6].basePrice + products[7].basePrice,
          bundlePrice: (products[6].basePrice + products[7].basePrice) * 0.7
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a',
            alt: 'Holiday Bundle'
          }
        ],
        seller: seller._id,
        status: 'active',
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        stock: {
          quantity: 100,
          sold: 0
        }
      }
    ];
    
    console.log('🌱 Seeding bundles...');
    const createdBundles = [];
    
    for (const bundleData of bundles) {
      const bundle = await ProductBundle.create(bundleData);
      createdBundles.push(bundle);
    }
    
    console.log(`✅ Successfully seeded ${createdBundles.length} bundles`);
    console.log('\nBundle Details:');
    createdBundles.forEach(bundle => {
      console.log(`\n📦 ${bundle.name}`);
      console.log(`   Products: ${bundle.products.length}`);
      console.log(`   Original: $${bundle.pricing.originalPrice.toFixed(2)}`);
      console.log(`   Bundle: $${bundle.pricing.bundlePrice.toFixed(2)}`);
      console.log(`   Savings: ${bundle.pricing.discountPercentage}%`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding bundles:', error);
    process.exit(1);
  }
};

seedBundles();

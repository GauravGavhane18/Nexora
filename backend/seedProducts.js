import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 MongoDB Connected');

    // Get seller user
    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('❌ No seller found. Please run resetUsers.js first');
      process.exit(1);
    }

    // Create categories
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', isActive: true, createdBy: seller._id },
      { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', isActive: true, createdBy: seller._id },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home and garden products', isActive: true, createdBy: seller._id },
    ];

    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Created categories');

    // Create products
    const products = [
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium wireless headphones with noise cancellation',
        shortDescription: 'High-quality sound with 30-hour battery life',
        category: createdCategories[0]._id,
        brand: 'AudioTech',
        productType: 'physical',
        basePrice: 299.99,
        comparePrice: 399.99,
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Wireless Headphones', isPrimary: true }],
        tags: ['audio', 'wireless', 'headphones'],
        inventory: { quantity: 50, trackQuantity: true, lowStockThreshold: 10 },
        seller: seller._id,
        status: 'published',
        publishedAt: new Date(),
        createdBy: seller._id,
        isActive: true
      },
      {
        name: 'Smart Watch',
        slug: 'smart-watch',
        description: 'Feature-rich smartwatch with fitness tracking',
        shortDescription: 'Track your health and stay connected',
        category: createdCategories[0]._id,
        brand: 'TechWear',
        productType: 'physical',
        basePrice: 199.99,
        comparePrice: 299.99,
        images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Smart Watch', isPrimary: true }],
        tags: ['smartwatch', 'fitness', 'wearable'],
        inventory: { quantity: 75, trackQuantity: true, lowStockThreshold: 15 },
        seller: seller._id,
        status: 'published',
        publishedAt: new Date(),
        createdBy: seller._id,
        isActive: true
      },
      {
        name: 'Mechanical Keyboard',
        slug: 'mechanical-keyboard',
        description: 'RGB mechanical gaming keyboard with custom switches',
        shortDescription: 'Professional gaming keyboard',
        category: createdCategories[0]._id,
        brand: 'GameGear',
        productType: 'physical',
        basePrice: 159.99,
        comparePrice: 199.99,
        images: [{ url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500', alt: 'Mechanical Keyboard', isPrimary: true }],
        tags: ['keyboard', 'gaming', 'rgb'],
        inventory: { quantity: 40, trackQuantity: true, lowStockThreshold: 10 },
        seller: seller._id,
        status: 'published',
        publishedAt: new Date(),
        createdBy: seller._id,
        isActive: true
      },
      {
        name: 'Wireless Earbuds',
        slug: 'wireless-earbuds',
        description: 'True wireless earbuds with active noise cancellation',
        shortDescription: 'Premium sound in a compact design',
        category: createdCategories[0]._id,
        brand: 'AudioTech',
        productType: 'physical',
        basePrice: 179.99,
        comparePrice: 249.99,
        images: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', alt: 'Wireless Earbuds', isPrimary: true }],
        tags: ['earbuds', 'wireless', 'audio'],
        inventory: { quantity: 100, trackQuantity: true, lowStockThreshold: 20 },
        seller: seller._id,
        status: 'published',
        publishedAt: new Date(),
        createdBy: seller._id,
        isActive: true
      },
      {
        name: '4K Monitor',
        slug: '4k-monitor',
        description: 'Ultra HD 4K monitor with HDR support',
        shortDescription: 'Professional display for work and gaming',
        category: createdCategories[0]._id,
        brand: 'ViewPro',
        productType: 'physical',
        basePrice: 549.99,
        comparePrice: 699.99,
        images: [{ url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', alt: '4K Monitor', isPrimary: true }],
        tags: ['monitor', '4k', 'display'],
        inventory: { quantity: 25, trackQuantity: true, lowStockThreshold: 5 },
        seller: seller._id,
        status: 'published',
        publishedAt: new Date(),
        createdBy: seller._id,
        isActive: true
      },
      {
        name: 'Gaming Mouse',
        slug: 'gaming-mouse',
        description: 'High-precision wireless gaming mouse',
        shortDescription: 'Professional gaming mouse with RGB',
        category: createdCategories[0]._id,
        brand: 'GameGear',
        productType: 'physical',
        basePrice: 89.99,
        comparePrice: 119.99,
        images: [{ url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', alt: 'Gaming Mouse', isPrimary: true }],
        tags: ['mouse', 'gaming', 'wireless'],
        inventory: { quantity: 60, trackQuantity: true, lowStockThreshold: 15 },
        seller: seller._id,
        status: 'published',
        publishedAt: new Date(),
        createdBy: seller._id,
        isActive: true
      }
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('✅ Created products');

    console.log('\n🎉 Seed completed successfully!');
    console.log(`📦 Created ${products.length} products`);
    console.log(`📁 Created ${categories.length} categories\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedProducts();

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const premiumProducts = [
  // Electronics - Premium Laptops
  {
    name: 'MacBook Pro 16" M3 Max',
    slug: 'macbook-pro-16-m3-max',
    description: 'The most powerful MacBook Pro ever. With the M3 Max chip, stunning Liquid Retina XDR display, and up to 22 hours of battery life.',
    category: 'Electronics',
    basePrice: 3499,
    comparePrice: 3999,
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', alt: 'MacBook Pro' }
    ],
    inventory: { quantity: 25 },
    tags: ['laptop', 'apple', 'premium', 'professional'],
    ratings: { average: 4.9, count: 342 }
  },
  {
    name: 'Dell XPS 15 OLED',
    slug: 'dell-xps-15-oled',
    description: 'Stunning 15.6" OLED display, Intel Core i9, 32GB RAM, NVIDIA RTX 4070. Perfect for creators and professionals.',
    category: 'Electronics',
    basePrice: 2499,
    comparePrice: 2899,
    images: [
      { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', alt: 'Dell XPS' }
    ],
    inventory: { quantity: 30 },
    tags: ['laptop', 'dell', 'oled', 'gaming'],
    ratings: { average: 4.7, count: 256 }
  },
  // Electronics - Smartphones
  {
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Titanium design. A17 Pro chip. Action button. USB-C. All-new 48MP camera system.',
    category: 'Electronics',
    basePrice: 1199,
    comparePrice: 1299,
    images: [
      { url: 'https://images.unsplash.com/photo-1592286927505-2fd0d113e4e7?w=800', alt: 'iPhone 15 Pro' }
    ],
    inventory: { quantity: 50 },
    tags: ['smartphone', 'apple', 'premium', '5g'],
    ratings: { average: 4.8, count: 892 }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'AI-powered smartphone with 200MP camera, S Pen, and stunning 6.8" Dynamic AMOLED display.',
    category: 'Electronics',
    basePrice: 1299,
    comparePrice: 1399,
    images: [
      { url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', alt: 'Samsung Galaxy' }
    ],
    inventory: { quantity: 45 },
    tags: ['smartphone', 'samsung', 'android', '5g'],
    ratings: { average: 4.7, count: 654 }
  },
  {
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    description: 'Best Android camera phone. Google Tensor G3 chip. Magic Eraser. 7 years of updates.',
    category: 'Electronics',
    basePrice: 999,
    comparePrice: 1099,
    images: [
      { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', alt: 'Google Pixel' }
    ],
    inventory: { quantity: 40 },
    tags: ['smartphone', 'google', 'android', 'camera'],
    ratings: { average: 4.6, count: 423 }
  },
  // Electronics - Audio
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise cancellation. 30-hour battery. Premium sound quality.',
    category: 'Electronics',
    basePrice: 399,
    comparePrice: 449,
    images: [
      { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800', alt: 'Sony Headphones' }
    ],
    inventory: { quantity: 60 },
    tags: ['headphones', 'sony', 'wireless', 'noise-cancelling'],
    ratings: { average: 4.8, count: 1234 }
  },
  {
    name: 'AirPods Pro 2nd Gen',
    slug: 'airpods-pro-2nd-gen',
    description: 'Active Noise Cancellation. Adaptive Audio. Personalized Spatial Audio with USB-C.',
    category: 'Electronics',
    basePrice: 249,
    comparePrice: 279,
    images: [
      { url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', alt: 'AirPods Pro' }
    ],
    inventory: { quantity: 80 },
    tags: ['earbuds', 'apple', 'wireless', 'noise-cancelling'],
    ratings: { average: 4.7, count: 2341 }
  },
  {
    name: 'Bose QuietComfort Ultra',
    slug: 'bose-quietcomfort-ultra',
    description: 'World-class noise cancellation. Immersive audio. All-day comfort.',
    category: 'Electronics',
    basePrice: 429,
    comparePrice: 479,
    images: [
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', alt: 'Bose Headphones' }
    ],
    inventory: { quantity: 35 },
    tags: ['headphones', 'bose', 'wireless', 'premium'],
    ratings: { average: 4.6, count: 567 }
  },
  // Electronics - Tablets & Accessories
  {
    name: 'iPad Pro 12.9" M2',
    slug: 'ipad-pro-12-9-m2',
    description: 'Liquid Retina XDR display. M2 chip. Apple Pencil hover. All-day battery.',
    category: 'Electronics',
    basePrice: 1099,
    comparePrice: 1199,
    images: [
      { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', alt: 'iPad Pro' }
    ],
    inventory: { quantity: 40 },
    tags: ['tablet', 'apple', 'professional', 'creative'],
    ratings: { average: 4.8, count: 789 }
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    slug: 'samsung-galaxy-tab-s9-ultra',
    description: '14.6" Dynamic AMOLED display. S Pen included. DeX mode for desktop experience.',
    category: 'Electronics',
    basePrice: 1199,
    comparePrice: 1299,
    images: [
      { url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800', alt: 'Samsung Tab' }
    ],
    inventory: { quantity: 30 },
    tags: ['tablet', 'samsung', 'android', 'large-screen'],
    ratings: { average: 4.6, count: 432 }
  },
  {
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-series-9',
    description: 'S9 chip. Double tap gesture. Brighter display. Advanced health features.',
    category: 'Electronics',
    basePrice: 429,
    comparePrice: 479,
    images: [
      { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800', alt: 'Apple Watch' }
    ],
    inventory: { quantity: 70 },
    tags: ['smartwatch', 'apple', 'fitness', 'health'],
    ratings: { average: 4.7, count: 1567 }
  },
  // Fashion - Men's Clothing
  {
    name: 'Premium Leather Jacket',
    slug: 'premium-leather-jacket',
    description: 'Genuine Italian leather. Classic biker style. Timeless design.',
    category: 'Fashion',
    basePrice: 599,
    comparePrice: 799,
    images: [
      { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', alt: 'Leather Jacket' }
    ],
    inventory: { quantity: 25 },
    tags: ['jacket', 'leather', 'mens', 'premium'],
    ratings: { average: 4.5, count: 234 }
  },
  {
    name: 'Designer Denim Jeans',
    slug: 'designer-denim-jeans',
    description: 'Premium selvedge denim. Perfect fit. Made in Japan.',
    category: 'Fashion',
    basePrice: 189,
    comparePrice: 249,
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', alt: 'Denim Jeans' }
    ],
    inventory: { quantity: 50 },
    tags: ['jeans', 'denim', 'mens', 'casual'],
    ratings: { average: 4.4, count: 567 }
  },
  {
    name: 'Cashmere Sweater',
    slug: 'cashmere-sweater',
    description: '100% pure cashmere. Luxuriously soft. Available in 8 colors.',
    category: 'Fashion',
    basePrice: 299,
    comparePrice: 399,
    images: [
      { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800', alt: 'Cashmere Sweater' }
    ],
    inventory: { quantity: 40 },
    tags: ['sweater', 'cashmere', 'luxury', 'winter'],
    ratings: { average: 4.7, count: 345 }
  },
  // Fashion - Women's Clothing
  {
    name: 'Silk Evening Dress',
    slug: 'silk-evening-dress',
    description: 'Pure silk fabric. Elegant design. Perfect for special occasions.',
    category: 'Fashion',
    basePrice: 449,
    comparePrice: 599,
    images: [
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', alt: 'Evening Dress' }
    ],
    inventory: { quantity: 20 },
    tags: ['dress', 'silk', 'womens', 'formal'],
    ratings: { average: 4.8, count: 189 }
  },
  {
    name: 'Designer Handbag',
    slug: 'designer-handbag',
    description: 'Genuine leather. Timeless design. Multiple compartments.',
    category: 'Fashion',
    basePrice: 899,
    comparePrice: 1199,
    images: [
      { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', alt: 'Designer Handbag' }
    ],
    inventory: { quantity: 15 },
    tags: ['handbag', 'leather', 'womens', 'luxury'],
    ratings: { average: 4.6, count: 234 }
  },
  {
    name: 'Wool Coat',
    slug: 'wool-coat',
    description: 'Premium wool blend. Classic trench style. Water-resistant.',
    category: 'Fashion',
    basePrice: 399,
    comparePrice: 549,
    images: [
      { url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', alt: 'Wool Coat' }
    ],
    inventory: { quantity: 30 },
    tags: ['coat', 'wool', 'womens', 'winter'],
    ratings: { average: 4.5, count: 456 }
  },
  // Fashion - Footwear
  {
    name: 'Nike Air Max 2024',
    slug: 'nike-air-max-2024',
    description: 'Revolutionary Air cushioning. Breathable mesh. Ultimate comfort.',
    category: 'Fashion',
    basePrice: 179,
    comparePrice: 219,
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: 'Nike Shoes' }
    ],
    inventory: { quantity: 100 },
    tags: ['shoes', 'nike', 'sneakers', 'sports'],
    ratings: { average: 4.7, count: 2345 }
  },
  {
    name: 'Adidas Ultraboost 23',
    slug: 'adidas-ultraboost-23',
    description: 'Boost technology. Primeknit upper. Energy return with every step.',
    category: 'Fashion',
    basePrice: 189,
    comparePrice: 229,
    images: [
      { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', alt: 'Adidas Shoes' }
    ],
    inventory: { quantity: 90 },
    tags: ['shoes', 'adidas', 'running', 'sports'],
    ratings: { average: 4.6, count: 1876 }
  },
  {
    name: 'Leather Oxford Shoes',
    slug: 'leather-oxford-shoes',
    description: 'Handcrafted Italian leather. Classic design. Perfect for formal occasions.',
    category: 'Fashion',
    basePrice: 249,
    comparePrice: 329,
    images: [
      { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800', alt: 'Oxford Shoes' }
    ],
    inventory: { quantity: 40 },
    tags: ['shoes', 'leather', 'formal', 'mens'],
    ratings: { average: 4.5, count: 432 }
  },
  // Home & Garden
  {
    name: 'Smart Coffee Maker',
    slug: 'smart-coffee-maker',
    description: 'WiFi enabled. Schedule brewing from your phone. Perfect coffee every time.',
    category: 'Home & Garden',
    basePrice: 299,
    comparePrice: 399,
    images: [
      { url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800', alt: 'Coffee Maker' }
    ],
    inventory: { quantity: 45 },
    tags: ['coffee', 'smart-home', 'kitchen', 'appliance'],
    ratings: { average: 4.4, count: 678 }
  },
  {
    name: 'Robot Vacuum Cleaner',
    slug: 'robot-vacuum-cleaner',
    description: 'AI-powered navigation. Self-emptying. Works with Alexa and Google Home.',
    category: 'Home & Garden',
    basePrice: 599,
    comparePrice: 799,
    images: [
      { url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800', alt: 'Robot Vacuum' }
    ],
    inventory: { quantity: 30 },
    tags: ['vacuum', 'robot', 'smart-home', 'cleaning'],
    ratings: { average: 4.6, count: 1234 }
  },
  {
    name: 'Air Purifier Pro',
    slug: 'air-purifier-pro',
    description: 'HEPA H13 filter. Removes 99.97% of particles. Quiet operation.',
    category: 'Home & Garden',
    basePrice: 399,
    comparePrice: 499,
    images: [
      { url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800', alt: 'Air Purifier' }
    ],
    inventory: { quantity: 50 },
    tags: ['air-purifier', 'health', 'home', 'appliance'],
    ratings: { average: 4.5, count: 890 }
  },
  // Home & Garden - Furniture
  {
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Lumbar support. Breathable mesh. Adjustable everything. 10-year warranty.',
    category: 'Home & Garden',
    basePrice: 599,
    comparePrice: 799,
    images: [
      { url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800', alt: 'Office Chair' }
    ],
    inventory: { quantity: 35 },
    tags: ['chair', 'office', 'ergonomic', 'furniture'],
    ratings: { average: 4.7, count: 567 }
  },
  {
    name: 'Standing Desk Electric',
    slug: 'standing-desk-electric',
    description: 'Height adjustable. Memory presets. Cable management. Solid wood top.',
    category: 'Home & Garden',
    basePrice: 799,
    comparePrice: 999,
    images: [
      { url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800', alt: 'Standing Desk' }
    ],
    inventory: { quantity: 20 },
    tags: ['desk', 'office', 'standing', 'furniture'],
    ratings: { average: 4.6, count: 345 }
  },
  {
    name: 'Luxury Sofa Set',
    slug: 'luxury-sofa-set',
    description: 'Italian leather. Modular design. Deep seating. Available in 6 colors.',
    category: 'Home & Garden',
    basePrice: 2499,
    comparePrice: 3299,
    images: [
      { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', alt: 'Luxury Sofa' }
    ],
    inventory: { quantity: 10 },
    tags: ['sofa', 'furniture', 'luxury', 'living-room'],
    ratings: { average: 4.8, count: 234 }
  },
  // Sports & Fitness
  {
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Heart rate monitoring. GPS tracking. 100+ workout modes. 14-day battery.',
    category: 'Sports & Fitness',
    basePrice: 249,
    comparePrice: 329,
    images: [
      { url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800', alt: 'Fitness Watch' }
    ],
    inventory: { quantity: 60 },
    tags: ['watch', 'fitness', 'smart', 'health'],
    ratings: { average: 4.5, count: 1234 }
  },
  {
    name: 'Adjustable Dumbbells',
    slug: 'adjustable-dumbbells',
    description: 'Space-saving design. 5-52.5 lbs per dumbbell. Quick weight adjustment.',
    category: 'Sports & Fitness',
    basePrice: 399,
    comparePrice: 499,
    images: [
      { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', alt: 'Dumbbells' }
    ],
    inventory: { quantity: 40 },
    tags: ['dumbbells', 'fitness', 'home-gym', 'strength'],
    ratings: { average: 4.7, count: 789 }
  },
  {
    name: 'Yoga Mat Premium',
    slug: 'yoga-mat-premium',
    description: 'Extra thick. Non-slip surface. Eco-friendly materials. Carrying strap included.',
    category: 'Sports & Fitness',
    basePrice: 79,
    comparePrice: 99,
    images: [
      { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', alt: 'Yoga Mat' }
    ],
    inventory: { quantity: 100 },
    tags: ['yoga', 'mat', 'fitness', 'exercise'],
    ratings: { average: 4.4, count: 2345 }
  },
  // Books & Media
  {
    name: 'Kindle Paperwhite Signature',
    slug: 'kindle-paperwhite-signature',
    description: 'Wireless charging. Auto-adjusting front light. 32GB storage. Waterproof.',
    category: 'Books & Media',
    basePrice: 189,
    comparePrice: 219,
    images: [
      { url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800', alt: 'Kindle' }
    ],
    inventory: { quantity: 70 },
    tags: ['kindle', 'ereader', 'books', 'amazon'],
    ratings: { average: 4.6, count: 3456 }
  },
  {
    name: 'Bluetooth Speaker Portable',
    slug: 'bluetooth-speaker-portable',
    description: '360° sound. Waterproof. 24-hour battery. Deep bass.',
    category: 'Books & Media',
    basePrice: 149,
    comparePrice: 199,
    images: [
      { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800', alt: 'Bluetooth Speaker' }
    ],
    inventory: { quantity: 80 },
    tags: ['speaker', 'bluetooth', 'portable', 'audio'],
    ratings: { average: 4.5, count: 1567 }
  },
  {
    name: '4K Streaming Device',
    slug: '4k-streaming-device',
    description: 'Dolby Vision. Voice remote. All streaming apps. Lightning fast.',
    category: 'Books & Media',
    basePrice: 59,
    comparePrice: 79,
    images: [
      { url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800', alt: 'Streaming Device' }
    ],
    inventory: { quantity: 120 },
    tags: ['streaming', '4k', 'entertainment', 'tv'],
    ratings: { average: 4.4, count: 4567 }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Get admin user for creating categories
    const admin = await User.findOne({ role: 'admin' });
    const seller = await User.findOne({ role: 'seller' });
    
    console.log('Admin found:', admin ? admin.email : 'NO');
    console.log('Seller found:', seller ? seller.email : 'NO');
    
    if (!seller || !admin) {
      console.error('❌ No seller or admin found. Run resetUsers.js first');
      process.exit(1);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Create or get categories
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports & Fitness', 'Books & Media'];
    const categoryDocs = {};

    for (const catName of categories) {
      let category = await Category.findOne({ name: catName });
      if (!category) {
        console.log(`Creating category: ${catName} with admin ID: ${admin._id}`);
        category = await Category.create({
          name: catName,
          slug: catName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
          description: `Premium ${catName} products`,
          isActive: true,
          createdBy: admin._id
        });
        console.log(`✅ Created category: ${catName}`);
      } else {
        console.log(`✅ Found existing category: ${catName}`);
      }
      categoryDocs[catName] = category._id;
    }

    console.log('✅ Categories ready');

    // Create products
    const createdProducts = [];
    for (const productData of premiumProducts) {
      const product = await Product.create({
        ...productData,
        category: categoryDocs[productData.category],
        seller: seller._id,
        status: 'published',
        isActive: true
      });
      createdProducts.push(product);
    }

    console.log(`Created ${createdProducts.length} premium products`);
    console.log('\n Database seeded successfully!');
    console.log(`📦 Total products: ${createdProducts.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

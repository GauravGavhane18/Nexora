import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import User from './models/User.js';

dotenv.config();

const seedEnhanced = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 MongoDB Connected');

    // Get seller user
    let seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('⚠️ No seller found. Creating a default seller...');
      const newSeller = await User.create({
        firstName: 'Test',
        lastName: 'Seller',
        email: 'seller@test.com',
        password: 'password123', // Will be hashed by pre-save hook
        role: 'seller',
        isEmailVerified: true,
        sellerProfile: {
          businessName: 'NEXORA Retail',
          isApproved: true
        }
      });
      seller = newSeller;
      console.log('✅ Created default seller: seller@test.com');
    }

    // Create comprehensive categories
    const categories = [
      { name: 'Electronics', slug: 'electronics', description: 'Latest electronic devices and gadgets', isActive: true, createdBy: seller._id },
      { name: 'Fashion & Clothing', slug: 'fashion-clothing', description: 'Trendy clothing and accessories', isActive: true, createdBy: seller._id },
      { name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies', isActive: true, createdBy: seller._id },
      { name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Sports equipment and fitness gear', isActive: true, createdBy: seller._id },
      { name: 'Books & Media', slug: 'books-media', description: 'Books, movies, and music', isActive: true, createdBy: seller._id },
      { name: 'Toys & Games', slug: 'toys-games', description: 'Toys and games for all ages', isActive: true, createdBy: seller._id },
      { name: 'Beauty & Health', slug: 'beauty-health', description: 'Beauty products and health supplements', isActive: true, createdBy: seller._id },
      { name: 'Automotive', slug: 'automotive', description: 'Car accessories and parts', isActive: true, createdBy: seller._id },
      { name: 'Food & Grocery', slug: 'food-grocery', description: 'Fresh food and grocery items', isActive: true, createdBy: seller._id },
      { name: 'Pet Supplies', slug: 'pet-supplies', description: 'Everything for your pets', isActive: true, createdBy: seller._id },
    ];

    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Created 10 categories');

    const getCat = (index) => createdCategories[index]._id;

    // Create comprehensive product catalog (65 products)
    const products = [
      // --- Electronics (Index 0) ---
      {
        name: 'iPhone 15 Pro Max',
        description: 'Titanium design, A17 Pro chip, 48MP Main camera, USB-C. The ultimate iPhone.',
        category: getCat(0), brand: 'Apple', basePrice: 1199, images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', isPrimary: true }],
        tags: ['smartphone', 'apple', 'ios', '5g', 'titanium', 'premium'], inventory: { quantity: 50 }, seller: seller._id
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Galaxy AI, 200MP camera, built-in S Pen, Snapdragon 8 Gen 3.',
        category: getCat(0), brand: 'Samsung', basePrice: 1299, images: [{ url: 'https://images.unsplash.com/photo-1707227137837-7756f71b1220?w=500', isPrimary: true }],
        tags: ['smartphone', 'android', 'samsung', 'ai', 'stylus'], inventory: { quantity: 40 }, seller: seller._id
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling headphones with Auto NC Optimizer.',
        category: getCat(0), brand: 'Sony', basePrice: 348, images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500', isPrimary: true }],
        tags: ['headphones', 'audio', 'wireless', 'noise-canceling', 'sony'], inventory: { quantity: 100 }, seller: seller._id
      },
      {
        name: 'MacBook Air M3 15-inch',
        description: 'Supercharged by M3, strikingly thin and light, 18 hours battery life.',
        category: getCat(0), brand: 'Apple', basePrice: 1299, images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', isPrimary: true }],
        tags: ['laptop', 'apple', 'macbook', 'computer', 'productivity'], inventory: { quantity: 30 }, seller: seller._id
      },
      {
        name: 'Dell XPS 13 Plus',
        description: 'Minimalist design, capacitive touch function row, zero-lattice keyboard.',
        category: getCat(0), brand: 'Dell', basePrice: 1199, images: [{ url: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500', isPrimary: true }],
        tags: ['laptop', 'dell', 'windows', 'ultrabook', 'premium'], inventory: { quantity: 25 }, seller: seller._id
      },
      {
        name: 'GoPro Hero 12 Black',
        description: 'Action camera with HDR video, HyperSmooth 6.0 stabilization.',
        category: getCat(0), brand: 'GoPro', basePrice: 399, images: [{ url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500', isPrimary: true }],
        tags: ['camera', 'action', 'video', 'waterproof', 'vlog', 'livestream-featured'], inventory: { quantity: 60 }, seller: seller._id
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Performance wireless mouse with ultrafast scrolling and 8K DPI tracking.',
        category: getCat(0), brand: 'Logitech', basePrice: 99, images: [{ url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', isPrimary: true }],
        tags: ['mouse', 'accessory', 'productivity', 'wireless'], inventory: { quantity: 150 }, seller: seller._id
      },
      {
        name: 'LG C3 OLED TV 65"',
        description: 'OLED evo G3, Brightness Booster Max, Dolby Vision & Atmos.',
        category: getCat(0), brand: 'LG', basePrice: 1699, images: [{ url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500', isPrimary: true }],
        tags: ['tv', 'oled', 'lg', 'home-theater', '4k'], inventory: { quantity: 10 }, seller: seller._id
      },

      // --- Fashion & Clothing (Index 1) ---
      {
        name: 'Nike Air Force 1 \'07',
        description: 'The radiance lives on in the Nike Air Force 1 \'07.',
        category: getCat(1), brand: 'Nike', basePrice: 115, images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', isPrimary: true }],
        tags: ['shoes', 'sneakers', 'nike', 'casual', 'white'], inventory: { quantity: 200 }, seller: seller._id
      },
      {
        name: 'Adidas Ultraboost Light',
        description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.',
        category: getCat(1), brand: 'Adidas', basePrice: 190, images: [{ url: 'https://images.unsplash.com/photo-1587563871167-1ee7c7358bcc?w=500', isPrimary: true }],
        tags: ['shoes', 'running', 'adidas', 'sports'], inventory: { quantity: 120 }, seller: seller._id
      },
      {
        name: 'Levi\'s 501 Original Fit Jeans',
        description: 'The blue jean that started it all. Signature straight fit.',
        category: getCat(1), brand: 'Levi\'s', basePrice: 79.50, images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', isPrimary: true }],
        tags: ['clothing', 'jeans', 'denim', 'pants', 'levis'], inventory: { quantity: 80 }, seller: seller._id
      },
      {
        name: 'Patagonia Better Sweater Fleece',
        description: 'Knitted cross-dye pullover with fleece interior for warmth.',
        category: getCat(1), brand: 'Patagonia', basePrice: 139, images: [{ url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500', isPrimary: true }],
        tags: ['clothing', 'fleece', 'outdoor', 'sustainable', 'patagonia'], inventory: { quantity: 45 }, seller: seller._id
      },
      {
        name: 'Ray-Ban Aviator Classic',
        description: 'Timeless sunglass model that combines great aviator styling with exceptional quality.',
        category: getCat(1), brand: 'Ray-Ban', basePrice: 171, images: [{ url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', isPrimary: true }],
        tags: ['accessories', 'sunglasses', 'summer', 'fashion'], inventory: { quantity: 60 }, seller: seller._id
      },
      {
        name: 'Zara Oversized Blazer',
        description: 'Blazer with lapel collar and long sleeves. Front flap pockets.',
        category: getCat(1), brand: 'Zara', basePrice: 89.90, images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', isPrimary: true }],
        tags: ['clothing', 'formal', 'blazer', 'fashion', 'women'], inventory: { quantity: 50 }, seller: seller._id
      },
      {
        name: 'Casio G-Shock GA2100',
        description: 'Carbon Core Guard structure, thinner case, octagonal bezel.',
        category: getCat(1), brand: 'Casio', basePrice: 99, images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500', isPrimary: true }],
        tags: ['watch', 'accessories', 'rugged', 'casio'], inventory: { quantity: 150 }, seller: seller._id
      },

      // --- Home & Garden (Index 2) ---
      {
        name: 'Dyson V15 Detect',
        description: 'Laser detects microscopic dust. Intelligent torque cleaner head.',
        category: getCat(2), brand: 'Dyson', basePrice: 749, images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', isPrimary: true }],
        tags: ['home', 'vacuum', 'cleaning', 'appliance', 'dyson'], inventory: { quantity: 20 }, seller: seller._id
      },
      {
        name: 'Philips Hue Starter Kit',
        description: 'White and Color Ambiance. Smart lighting for your home.',
        category: getCat(2), brand: 'Philips', basePrice: 199, images: [{ url: 'https://images.unsplash.com/photo-1558002038-1091cb6a60e9?w=500', isPrimary: true }],
        tags: ['smart-home', 'lighting', 'iot', 'philips'], inventory: { quantity: 40 }, seller: seller._id
      },
      {
        name: 'Herman Miller Aeron Chair',
        description: 'The benchmark for ergonomic seating. Remastered for today\'s work.',
        category: getCat(2), brand: 'Herman Miller', basePrice: 1400, images: [{ url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500', isPrimary: true }],
        tags: ['furniture', 'office', 'chair', 'ergonomic', 'premium'], inventory: { quantity: 10 }, seller: seller._id
      },
      {
        name: 'KitchenAid Artisan Stand Mixer',
        description: 'Iconic stand mixer with 10 speeds and 5-quart capacity.',
        category: getCat(2), brand: 'KitchenAid', basePrice: 449, images: [{ url: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=500', isPrimary: true }],
        tags: ['kitchen', 'appliance', 'baking', 'cooking'], inventory: { quantity: 35 }, seller: seller._id
      },
      {
        name: 'DeWalt 20V MAX Cordless Drill',
        description: 'Compact drill/driver kit with two batteries.',
        category: getCat(2), brand: 'DeWalt', basePrice: 99, images: [{ url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500', isPrimary: true }],
        tags: ['tools', 'diy', 'home-improvement', 'construction'], inventory: { quantity: 80 }, seller: seller._id
      },
      {
        name: 'Succulent Plant Set (3-Pack)',
        description: 'Live succulent plants in ceramic pots. Easy to care for.',
        category: getCat(2), brand: 'GreenLife', basePrice: 29.99, images: [{ url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', isPrimary: true }],
        tags: ['garden', 'plants', 'decor', 'indoor'], inventory: { quantity: 100 }, seller: seller._id
      },

      // --- Sports & Fitness (Index 3) ---
      {
        name: 'Peloton Bike+',
        description: 'Cardio, strength, yoga and more. Rotating screen for floor workouts.',
        category: getCat(3), brand: 'Peloton', basePrice: 2495, images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', isPrimary: true }],
        tags: ['fitness', 'exercise', 'bike', 'home-gym', 'cardio'], inventory: { quantity: 15 }, seller: seller._id
      },
      {
        name: 'Lululemon Align Leggings',
        description: 'Buttery soft fabric, lightweight feel. Perfect for yoga.',
        category: getCat(3), brand: 'Lululemon', basePrice: 98, images: [{ url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500', isPrimary: true }],
        tags: ['clothing', 'fitness', 'yoga', 'women'], inventory: { quantity: 100 }, seller: seller._id
      },
      {
        name: 'Bowflex SelectTech 552',
        description: 'Adjustable dumbbells ranging from 5 to 52.5 lbs.',
        category: getCat(3), brand: 'Bowflex', basePrice: 429, images: [{ url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500', isPrimary: true }],
        tags: ['fitness', 'weights', 'strength', 'home-gym'], inventory: { quantity: 30 }, seller: seller._id
      },
      {
        name: 'Wilson NBA Official Game Ball',
        description: 'Official game basketball of the NBA. Genuine leather.',
        category: getCat(3), brand: 'Wilson', basePrice: 199, images: [{ url: 'https://images.unsplash.com/photo-1519861531473-92002639313a?w=500', isPrimary: true }],
        tags: ['sports', 'basketball', 'nba', 'outdoor'], inventory: { quantity: 50 }, seller: seller._id
      },
      {
        name: 'Yeti Tundra 45 Cooler',
        description: 'Rotomolded cooler, keeps ice for days. Bear-resistant.',
        category: getCat(3), brand: 'Yeti', basePrice: 325, images: [{ url: 'https://images.unsplash.com/photo-1622485608670-3490cb54955b?w=500', isPrimary: true }],
        tags: ['outdoor', 'camping', 'cooler', 'travel'], inventory: { quantity: 40 }, seller: seller._id
      },

      // --- Books & Media (Index 4) ---
      {
        name: 'Atomic Habits',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
        category: getCat(4), brand: 'Penguin', basePrice: 16.99, images: [{ url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500', isPrimary: true }],
        tags: ['book', 'self-help', 'productivity', 'best-seller'], inventory: { quantity: 500 }, seller: seller._id
      },
      {
        name: 'The Psychology of Money',
        description: 'Timeless lessons on wealth, greed, and happiness.',
        category: getCat(4), brand: 'Morgan Housel', basePrice: 14.99, images: [{ url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500', isPrimary: true }],
        tags: ['book', 'finance', 'investing', 'money'], inventory: { quantity: 300 }, seller: seller._id
      },
      {
        name: 'Elden Ring (PS5)',
        description: 'Fantasy Action RPG Adventure by FromSoftware and George R.R. Martin.',
        category: getCat(4), brand: 'Bandai Namco', basePrice: 59.99, images: [{ url: 'https://images.unsplash.com/photo-1642456961625-709de850e0d6?w=500', isPrimary: true }],
        tags: ['video-game', 'ps5', 'rpg', 'gaming', 'livestream-featured'], inventory: { quantity: 100 }, seller: seller._id
      },
      {
        name: 'Kindle Paperwhite',
        description: 'Now with a 6.8" display and thinner borders, adjustable warm light.',
        category: getCat(4), brand: 'Amazon', basePrice: 139, images: [{ url: 'https://images.unsplash.com/photo-1593444284814-72266bdcb7c5?w=500', isPrimary: true }],
        tags: ['electronics', 'reading', 'ereader', 'book'], inventory: { quantity: 150 }, seller: seller._id
      },
      {
        name: 'Vinyl Record Player',
        description: 'Vintage style turntable with bluetooth speakers.',
        category: getCat(4), brand: 'Victrola', basePrice: 59.99, images: [{ url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=500', isPrimary: true }],
        tags: ['music', 'audio', 'vintage', 'vinyl'], inventory: { quantity: 45 }, seller: seller._id
      },

      // --- Toys & Games (Index 5) ---
      {
        name: 'LEGO Star Wars Millennium Falcon',
        description: '7541 pieces. The ultimate collector series set.',
        category: getCat(5), brand: 'LEGO', basePrice: 849, images: [{ url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=500', isPrimary: true }],
        tags: ['toy', 'lego', 'star-wars', 'collectible'], inventory: { quantity: 10 }, seller: seller._id
      },
      {
        name: 'Nintendo Switch OLED',
        description: '7-inch OLED screen, wide adjustable stand, wired LAN port.',
        category: getCat(5), brand: 'Nintendo', basePrice: 349, images: [{ url: 'https://images.unsplash.com/photo-1648419612727-414800965aa3?w=500', isPrimary: true }],
        tags: ['gaming', 'console', 'nintendo', 'handheld', 'livestream-featured'], inventory: { quantity: 80 }, seller: seller._id
      },
      {
        name: 'Monopoly Classic Game',
        description: 'The fast-dealing property trading game.',
        category: getCat(5), brand: 'Hasbro', basePrice: 19.99, images: [{ url: 'https://images.unsplash.com/photo-1610890716171-6b1c9f2bd272?w=500', isPrimary: true }],
        tags: ['game', 'board-game', 'family', 'classic'], inventory: { quantity: 200 }, seller: seller._id
      },
      {
        name: 'DJI Mini 4 Pro Drone',
        description: 'Mini Camera Drone with 4K HDR Video, 34-min Flight Time.',
        category: getCat(5), brand: 'DJI', basePrice: 759, images: [{ url: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500', isPrimary: true }],
        tags: ['drone', 'camera', 'photography', 'toy', 'tech'], inventory: { quantity: 25 }, seller: seller._id
      },
      {
        name: 'Magic: The Gathering Starter Kit',
        description: '2 ready-to-play 60-card decks.',
        category: getCat(5), brand: 'Wizards of the Coast', basePrice: 14.99, images: [{ url: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=500', isPrimary: true }],
        tags: ['game', 'cards', 'magic', 'fantasy'], inventory: { quantity: 100 }, seller: seller._id
      },

      // --- Beauty & Health (Index 6) ---
      {
        name: 'Dyson Airwrap Multi-styler',
        description: 'Curl. Shape. Smooth. Hide Flyaways. With no extreme heat.',
        category: getCat(6), brand: 'Dyson', basePrice: 599, images: [{ url: 'https://images.unsplash.com/photo-1628965620958-37d45bd4a229?w=500', isPrimary: true }],
        tags: ['beauty', 'hair', 'styling', 'dyson', 'premium'], inventory: { quantity: 30 }, seller: seller._id
      },
      {
        name: 'Olaplex No. 3 Hair Perfector',
        description: 'Repair damage and strengthen hair.',
        category: getCat(6), brand: 'Olaplex', basePrice: 30, images: [{ url: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=500', isPrimary: true }],
        tags: ['beauty', 'hair-care', 'treatment'], inventory: { quantity: 150 }, seller: seller._id
      },
      {
        name: 'La Mer Crème de la Mer',
        description: 'Ultra-rich cream that instantly immerses skin in healing moisture.',
        category: getCat(6), brand: 'La Mer', basePrice: 380, images: [{ url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', isPrimary: true }],
        tags: ['beauty', 'skincare', 'luxury', 'moisturizer'], inventory: { quantity: 20 }, seller: seller._id
      },
      {
        name: 'Fitbit Charge 6',
        description: 'Health & Fitness Tracker with GPS, Heart Rate, Sleep.',
        category: getCat(6), brand: 'Fitbit', basePrice: 159.95, images: [{ url: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500', isPrimary: true }],
        tags: ['health', 'fitness', 'tracker', 'wearable'], inventory: { quantity: 80 }, seller: seller._id
      },
      {
        name: 'Theragun Pro',
        description: 'Smart percussive therapy device. Deep market leading amplitude.',
        category: getCat(6), brand: 'Therabody', basePrice: 599, images: [{ url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500', isPrimary: true }],
        tags: ['health', 'recovery', 'massage', 'wellness'], inventory: { quantity: 40 }, seller: seller._id
      },

      // --- Automotive (Index 7) ---
      {
        name: 'Chemical Guys Car Wash Kit',
        description: '14-piece arsenal builder wash kit with bucket and soaps.',
        category: getCat(7), brand: 'Chemical Guys', basePrice: 99, images: [{ url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=500', isPrimary: true }],
        tags: ['automotive', 'cleaning', 'car-care', 'detailing'], inventory: { quantity: 60 }, seller: seller._id
      },
      {
        name: 'NOCO Boost Plus Jump Starter',
        description: '1000 Amp 12-Volt UltraSafe Lithium Jump Starter Box.',
        category: getCat(7), brand: 'NOCO', basePrice: 99.95, images: [{ url: 'https://images.unsplash.com/photo-1621360841013-c768371e93cf?w=500', isPrimary: true }],
        tags: ['automotive', 'battery', 'emergency', 'tools'], inventory: { quantity: 100 }, seller: seller._id
      },
      {
        name: 'Garmin Dash Cam 67W',
        description: 'Compact 1440p dash cam with 180-degree field of view.',
        category: getCat(7), brand: 'Garmin', basePrice: 249, images: [{ url: 'https://images.unsplash.com/photo-1593113598340-089de65a6f87?w=500', isPrimary: true }],
        tags: ['automotive', 'electronics', 'camera', 'safety'], inventory: { quantity: 45 }, seller: seller._id
      },

      // --- Food & Grocery (Index 8) ---
      {
        name: 'Starbucks Whole Bean Coffee',
        description: 'Pike Place Roast. Medium roast, 100% Arabica.',
        category: getCat(8), brand: 'Starbucks', basePrice: 12.99, images: [{ url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', isPrimary: true }],
        tags: ['food', 'coffee', 'groceries', 'beverage'], inventory: { quantity: 500 }, seller: seller._id
      },
      {
        name: 'Lindt Lindor Truffles',
        description: 'Milk Chocolate Truffles. Irresistibly smooth.',
        category: getCat(8), brand: 'Lindt', basePrice: 15.99, images: [{ url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500', isPrimary: true }],
        tags: ['food', 'chocolate', 'sweets', 'gift'], inventory: { quantity: 200 }, seller: seller._id
      },
      {
        name: 'Organic Extra Virgin Olive Oil',
        description: 'Cold pressed, unrefined. Product of Italy.',
        category: getCat(8), brand: 'Kirkland', basePrice: 18.99, images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd041c?w=500', isPrimary: true }],
        tags: ['food', 'cooking', 'oil', 'pantry'], inventory: { quantity: 150 }, seller: seller._id
      },
      {
        name: 'Matcha Green Tea Powder',
        description: 'Ceremonial Grade. Authentic Japanese Matcha.',
        category: getCat(8), brand: 'Encha', basePrice: 24.99, images: [{ url: 'https://images.unsplash.com/photo-1582791694773-a6117bd968ba?w=500', isPrimary: true }],
        tags: ['food', 'tea', 'matcha', 'healthy'], inventory: { quantity: 80 }, seller: seller._id
      },

      // --- Pet Supplies (Index 9) ---
      {
        name: 'Furbo 360 Dog Camera',
        description: 'Rotating 360 view, treat tossing, color night vision.',
        category: getCat(9), brand: 'Furbo', basePrice: 210, images: [{ url: 'https://images.unsplash.com/photo-1542253386-7e9b04751496?w=500', isPrimary: true }],
        tags: ['pet', 'camera', 'dog', 'tech', 'livestream-featured'], inventory: { quantity: 30 }, seller: seller._id
      },
      {
        name: 'Taste of the Wild Dog Food',
        description: 'High Prairie Canine Recipe with Roasted Bison & Roasted Venison.',
        category: getCat(9), brand: 'Taste of the Wild', basePrice: 54.99, images: [{ url: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?w=500', isPrimary: true }],
        tags: ['pet', 'food', 'dog', 'grain-free'], inventory: { quantity: 100 }, seller: seller._id
      },
      {
        name: 'Litter-Robot 4',
        description: 'Automatic self-cleaning cat litter box.',
        category: getCat(9), brand: 'Whisker', basePrice: 699, images: [{ url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500', isPrimary: true }],
        tags: ['pet', 'cat', 'cleaning', 'smart-home'], inventory: { quantity: 15 }, seller: seller._id
      },
      {
        name: 'Kong Classic Dog Toy',
        description: 'Durable rubber chew toy. Perfect for stuffing with treats.',
        category: getCat(9), brand: 'KONG', basePrice: 12.99, images: [{ url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500', isPrimary: true }],
        tags: ['pet', 'toy', 'dog', 'durable'], inventory: { quantity: 300 }, seller: seller._id
      },

      // --- Misc / Viral / Trending (Mixed) ---
      {
        name: 'Stanley Quencher H2.0 40oz',
        description: 'The viral tumbler that started it all. Keeps drinks cold for hours.',
        category: getCat(2), brand: 'Stanley', basePrice: 45, images: [{ url: 'https://images.unsplash.com/photo-1634734891244-934c264d8560?w=500', isPrimary: true }],
        tags: ['trending', 'cup', 'viral', 'lifestyle'], inventory: { quantity: 0 }, seller: seller._id // Out of stock example
      },
      {
        name: 'Ninja CREAMi Ice Cream Maker',
        description: 'Turn almost anything into ice cream, sorbet, milkshakes, and more.',
        category: getCat(2), brand: 'Ninja', basePrice: 199, images: [{ url: 'https://images.unsplash.com/photo-1501443762994-6b2620546533?w=500', isPrimary: true }],
        tags: ['kitchen', 'viral', 'ice-cream', 'dessert'], inventory: { quantity: 50 }, seller: seller._id
      },
      {
        name: 'Meta Quest 3',
        description: 'Breakthrough mixed reality. 4K+ Infinite Display.',
        category: getCat(0), brand: 'Meta', basePrice: 499, images: [{ url: 'https://images.unsplash.com/photo-1622979135225-d2ba269fb1bd?w=500', isPrimary: true }],
        tags: ['vr', 'gaming', 'metaverse', 'tech'], inventory: { quantity: 60 }, seller: seller._id
      },
      {
        name: 'Glossier You Perfume',
        description: 'The ultimate personal fragrance. Melts into your skin.',
        category: getCat(6), brand: 'Glossier', basePrice: 68, images: [{ url: 'https://images.unsplash.com/photo-1594035910387-fea477942698?w=500', isPrimary: true }],
        tags: ['beauty', 'perfume', 'fragrance', 'viral'], inventory: { quantity: 100 }, seller: seller._id
      },
      {
        name: 'Hoka One One Clifton 9',
        description: 'Light and plush for everyday miles.',
        category: getCat(1), brand: 'Hoka', basePrice: 145, images: [{ url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', isPrimary: true }],
        tags: ['shoes', 'running', 'comfort', 'trending'], inventory: { quantity: 75 }, seller: seller._id
      },
      {
        name: 'Ring Video Doorbell 4',
        description: '1080p HD video doorbell with improved video previews.',
        category: getCat(2), brand: 'Ring', basePrice: 159.99, images: [{ url: 'https://images.unsplash.com/photo-1558002038-1091cb6a60e9?w=500', isPrimary: true }],
        tags: ['smart-home', 'security', 'camera', 'amazon'], inventory: { quantity: 85 }, seller: seller._id
      },
      {
        name: 'Crocs Classic Clog',
        description: 'It\'s the iconic clog that started a comfort revolution around the world.',
        category: getCat(1), brand: 'Crocs', basePrice: 49.99, images: [{ url: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500', isPrimary: true }],
        tags: ['shoes', 'comfort', 'casual', 'trending'], inventory: { quantity: 300 }, seller: seller._id
      },
      {
        name: 'Bose QuietComfort Ultra',
        description: 'World-class noise cancellation, quieter than ever before.',
        category: getCat(0), brand: 'Bose', basePrice: 429, images: [{ url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', isPrimary: true }],
        tags: ['audio', 'headphones', 'bose', 'travel'], inventory: { quantity: 65 }, seller: seller._id
      },
      {
        name: 'Fujifilm Instax Mini 12',
        description: 'Compact instant camera. Built-in selfie mirror.',
        category: getCat(0), brand: 'Fujifilm', basePrice: 79.95, images: [{ url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500', isPrimary: true }],
        tags: ['camera', 'photography', 'retro', 'fun'], inventory: { quantity: 120 }, seller: seller._id
      },
      {
        name: 'Squishmallows Gordon the Shark',
        description: '16 inch soft plush toy. Ultra soft and cuddly.',
        category: getCat(5), brand: 'Squishmallows', basePrice: 24.99, images: [{ url: 'https://images.unsplash.com/photo-1616763355603-9755a640a287?w=500', isPrimary: true }],
        tags: ['toy', 'plush', 'viral', 'kids'], inventory: { quantity: 90 }, seller: seller._id
      },
      {
        name: 'Secret Lab Titan Evo 2022',
        description: 'Award-winning gaming chair. Gold standard in ergonomics.',
        category: getCat(2), brand: 'Secretlab', basePrice: 549, images: [{ url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500', isPrimary: true }],
        tags: ['furniture', 'gaming', 'chair', 'esports', 'livestream-featured'], inventory: { quantity: 25 }, seller: seller._id
      }
    ];

    await Product.deleteMany({});

    // Add processed timestamps and slugs
    const processedProducts = products.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      status: 'published',
      isActive: true,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      productType: 'physical',
      comparePrice: Math.round(p.basePrice * 1.2 * 100) / 100 // Auto generate nice compare price
    }));

    await Product.insertMany(processedProducts);
    console.log('✅ Created comprehensive product catalog (50+ items)');

    console.log('\n🎉 Enhanced seed completed successfully!');
    console.log(`📦 Created ${products.length} products`);
    console.log(`📁 Created ${categories.length} categories\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedEnhanced();

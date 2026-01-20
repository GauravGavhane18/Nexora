
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Product from './models/Product.js';
import Auction from './models/Auction.js';
import Category from './models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecomm';

const createMockAuction = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // 1. Get a Seller
        let seller = await User.findOne({ role: 'seller' });
        if (!seller) {
            console.log('Creating mock seller...');
            seller = await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'mock_seller@nexora.com',
                password: 'password123',
                role: 'seller',
                isEmailVerified: true
            });
        }
        console.log(`Using Seller: ${seller._id}`);

        // 2. Get a Category
        let category = await Category.findOne();
        if (!category) {
            category = await Category.create({
                name: 'Electronics',
                slug: 'electronics',
                description: 'Electronic Items'
            });
        }

        // 3. Create a Product
        console.log('Creating Product...');
        const product = await Product.create({
            name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
            description: "Industry-leading noise cancellation optimized to you1. Magnificent Sound, engineered to perfection.",
            category: category._id,
            basePrice: 349,
            seller: seller._id,
            status: 'published',
            inventory: { quantity: 10 },
            productType: 'physical',
            images: [
                { url: "https://m.media-amazon.com/images/I/416t8k9jGSL._AC_SY879_.jpg", alt: "Sony Headphones" }
            ]
        });
        console.log(`Product Created: ${product._id}`);

        // 4. Create Auction
        console.log('Creating Auction...');
        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        const auction = await Auction.create({
            product: product._id,
            seller: seller._id,
            title: "Sony WH-1000XM5 - 24Hr Special Auction",
            description: "Brand new, sealed box. Bidding starts at $100!",
            startingPrice: 100,
            currentBid: 0,
            startTime: startTime,
            endTime: endTime,
            status: 'active'
        });

        console.log('-----------------------------------');
        console.log('SUCCESS: Mock Auction Created!');
        console.log(`Auction ID: ${auction._id}`);
        console.log(`Product: ${product.name}`);
        console.log(`End Time: ${endTime}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createMockAuction();

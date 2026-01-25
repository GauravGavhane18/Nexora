
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        if (typeof Product.getRecommendations === 'function') {
            console.log('✅ Product.getRecommendations is a function');
        } else {
            console.error('❌ Product.getRecommendations is NOT a function');
            console.log('Product keys:', Object.keys(Product));
            console.log('Product prototype keys:', Object.keys(Object.getPrototypeOf(Product)));
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

test();

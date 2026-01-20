
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the current directory
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Starting Admin Creation Script...');
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecomm';
console.log(`Attempting to connect to MongoDB at: ${uri}`);

const createAdmin = async () => {
    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // Timeout after 5s
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const adminEmail = 'admin@nexora.com';
        const adminPassword = 'admin123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating role to admin...');
            existingAdmin.role = 'admin';
            existingAdmin.password = adminPassword;
            existingAdmin.firstName = 'Super';
            existingAdmin.lastName = 'Admin';
            existingAdmin.isEmailVerified = true;
            existingAdmin.isActive = true;
            existingAdmin.isDeleted = false;
            await existingAdmin.save();
            console.log('Admin user updated successfully');
        } else {
            console.log('Creating new admin user...');
            await User.create({
                firstName: 'Super',
                lastName: 'Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                isEmailVerified: true,
                isActive: true
            });
            console.log('Admin user created successfully');
        }

        console.log('-----------------------------------');
        console.log('Login Credentials:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();

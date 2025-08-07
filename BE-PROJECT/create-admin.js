const mongoose = require('mongoose');
const User = require('./db/models/User');
const connectDB = require('./db/config');

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        
        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@rizzards.com',
            password: 'admin123',
            role: 'admin'
        });
        
        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser(); 
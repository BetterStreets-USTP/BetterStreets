require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createSpecificAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const email = 'betterstreetschatgpt@gmail.com';
    
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('✅ Admin account already exists!');
      console.log('\n📋 Login Details:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Email: ${email}`);
      console.log('Password: admin123');
      console.log('Role: Admin');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    const admin = await User.create({
      name: 'BetterStreets Admin',
      email: email,
      password: 'admin123',
      phone: '09123456789',
      address: 'Barangay Camaman-an, Cagayan de Oro City',
      role: 'admin',
      isVerified: true
    });

    console.log('✅ Admin account created successfully!');
    console.log('\n📋 Login Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${email}`);
    console.log('Password: admin123');
    console.log('Role: Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createSpecificAdmin();

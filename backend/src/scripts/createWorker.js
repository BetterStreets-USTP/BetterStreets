require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createWorker = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if worker already exists
    const existingWorker = await User.findOne({ email: 'worker@betterstreets.local' });
    if (existingWorker) {
      console.log('Worker account already exists!');
      console.log('\nLogin Details:');
      console.log('Email: worker@betterstreets.local');
      console.log('Password: worker123');
      process.exit(0);
    }

    // Create worker account
    const worker = await User.create({
      name: 'Juan Dela Cruz',
      email: 'worker@betterstreets.local',
      password: 'worker123',
      phone: '09123456789',
      address: 'Camaman-an, Cagayan de Oro City',
      role: 'barangay_staff',
      isVerified: true
    });

    console.log('✅ Barangay Worker account created successfully!');
    console.log('\n📋 Login Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email: worker@betterstreets.local');
    console.log('Password: worker123');
    console.log('Role: Barangay Staff');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating worker:', error);
    process.exit(1);
  }
};

createWorker();

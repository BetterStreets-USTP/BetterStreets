const mongoose = require('mongoose');
const Announcement = require('../models/Announcement');
const User = require('../models/User');
require('dotenv').config();

async function seedAnnouncements() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/betterstreets');

    console.log('✅ Connected to MongoDB');

    // Find or create an admin user for announcements
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('⚠️  No admin user found. Creating one...');
      adminUser = await User.create({
        name: 'Barangay Admin',
        email: 'admin@betterstreets.local',
        password: 'admin123', // Will be hashed by pre-save hook
        role: 'admin',
        barangay: 'Camaman-an'
      });
      console.log('✅ Created admin user');
    } else {
      console.log(`✅ Using existing admin user: ${adminUser.name}`);
    }

    const sampleAnnouncements = [
      {
        title: '🎉 Welcome to BetterStreets!',
        content: 'We are excited to launch this community reporting system for Camaman-an, Cagayan de Oro City. Help us make our barangay better by reporting issues you encounter.',
        category: 'General',
        priority: 'high',
        isActive: true,
        author: adminUser._id,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      },
      {
        title: '🚧 Road Maintenance Schedule',
        content: 'Road maintenance will be conducted along Main Street from December 9-15, 2025. Please use alternative routes during this period. Thank you for your patience and cooperation.',
        category: 'Maintenance',
        priority: 'high',
        isActive: true,
        author: adminUser._id,
        expiresAt: new Date('2025-12-16')
      },
      {
        title: '💡 Tip: Report with Photos',
        content: 'Did you know? Reports with photos get processed 50% faster! Take clear pictures of the issue from multiple angles to help us resolve it quickly.',
        category: 'General',
        priority: 'low',
        isActive: true,
        author: adminUser._id
      },
      {
        title: '🌟 Thank You to Our Community',
        content: 'This month, we received and resolved 150+ community reports! Thank you for actively participating in making Camaman-an a better place to live.',
        category: 'Update',
        priority: 'normal',
        isActive: true,
        author: adminUser._id
      },
      {
        title: '📋 How to Track Your Reports',
        content: 'You can now track the status of your reports in the "My Reports" section. Get real-time updates when your reports are reviewed, in progress, or resolved!',
        category: 'Update',
        priority: 'normal',
        isActive: true,
        author: adminUser._id
      }
    ];

    // Clear existing announcements
    await Announcement.deleteMany({});
    console.log('🗑️  Cleared existing announcements');

    // Insert sample announcements
    const result = await Announcement.insertMany(sampleAnnouncements);
    console.log(`✅ Successfully created ${result.length} announcements`);

    // Display created announcements
    console.log('\n📢 Created Announcements:');
    result.forEach((announcement, index) => {
      console.log(`\n${index + 1}. ${announcement.title}`);
      console.log(`   Category: ${announcement.category} | Priority: ${announcement.priority}`);
    });

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding announcements:', error);
    process.exit(1);
  }
}

seedAnnouncements();

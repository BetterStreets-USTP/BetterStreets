// Script to seed categories into database
const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.seedDefaults();
    console.log('✅ Categories seeded successfully');

    const categories = await Category.find();
    console.log('\n📋 Available Categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.category_name}: ${cat.keywords.length} keywords`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();

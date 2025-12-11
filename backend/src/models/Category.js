const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  keywords: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#10b981'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Seed default categories with keywords for auto-classification
categorySchema.statics.seedDefaults = async function() {
  const categories = [
    {
      category_name: 'Road Damage',
      keywords: ['road', 'pothole', 'crack', 'pavement', 'asphalt', 'street', 'highway', 'damage'],
      description: 'Road damage, potholes, cracks, and pavement issues',
      color: '#ef4444'
    },
    {
      category_name: 'Street Lighting',
      keywords: ['light', 'lighting', 'lamp', 'bulb', 'dark', 'broken light', 'streetlight'],
      description: 'Street lighting problems and broken lamps',
      color: '#f59e0b'
    },
    {
      category_name: 'Garbage/Waste',
      keywords: ['garbage', 'trash', 'waste', 'rubbish', 'dump', 'litter', 'basura'],
      description: 'Improper waste disposal and garbage issues',
      color: '#10b981'
    },
    {
      category_name: 'Drainage/Flooding',
      keywords: ['drainage', 'flood', 'flooding', 'water', 'clog', 'blocked', 'overflow', 'baha'],
      description: 'Drainage problems and flooding issues',
      color: '#3b82f6'
    },
    {
      category_name: 'Illegal Activity',
      keywords: ['illegal', 'crime', 'suspicious', 'theft', 'vandalism', 'trespassing'],
      description: 'Illegal activities and suspicious behavior',
      color: '#dc2626'
    },
    {
      category_name: 'Public Safety',
      keywords: ['safety', 'danger', 'hazard', 'risk', 'emergency', 'accident'],
      description: 'Public safety concerns and hazards',
      color: '#f59e0b'
    },
    {
      category_name: 'Infrastructure',
      keywords: ['infrastructure', 'building', 'structure', 'bridge', 'facility', 'construction'],
      description: 'Infrastructure and construction issues',
      color: '#6366f1'
    },
    {
      category_name: 'Other',
      keywords: ['other', 'miscellaneous', 'general'],
      description: 'Other concerns not categorized above',
      color: '#6b7280'
    }
  ];

  for (const cat of categories) {
    await this.findOneAndUpdate(
      { category_name: cat.category_name },
      cat,
      { upsert: true, new: true }
    );
  }
};

module.exports = mongoose.model('Category', categorySchema);

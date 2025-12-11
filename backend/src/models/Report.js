const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Road Damage',
      'Street Lighting',
      'Garbage/Waste',
      'Drainage/Flooding',
      'Illegal Activity',
      'Public Safety',
      'Infrastructure',
      'Other'
    ]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  photos: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedAgency: {
    type: String,
    trim: true,
    enum: [
      'Barangay Maintenance Team',
      'Sanitation Department',
      'Traffic Management',
      'Engineering Office',
      'Health Services',
      'Peace and Order',
      'Social Welfare',
      'Not Yet Assigned',
      null
    ],
    default: null
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resolvedAt: {
    type: Date
  },
  adminNotes: {
    type: String,
    trim: true
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'rejected'],
      required: true
    },
    assignedAgency: {
      type: String,
      trim: true
    },
    remarks: {
      type: String,
      trim: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
reportSchema.index({ location: '2dsphere' });

// Update timestamp on save
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', reportSchema);

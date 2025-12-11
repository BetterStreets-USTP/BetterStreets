const Report = require('../models/Report');
const User = require('../models/User');
const { classifyCategory } = require('../utils/categoryClassifier');
const { sendPushNotification, getNotificationContent } = require('../utils/notificationService');

// @desc    Create new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { title, description, category, location, address } = req.body;

    // Smart auto-classification based on keywords
    const classifiedCategory = classifyCategory(title, description, category);

    // Process uploaded photos
    const photos = req.files ? req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`
    })) : [];

    const report = await Report.create({
      title,
      description,
      category: classifiedCategory,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address
      },
      photos,
      reporter: req.user._id,
      statusHistory: [{
        status: 'pending',
        remarks: 'Report submitted',
        updatedBy: req.user._id,
        timestamp: new Date()
      }]
    });

    const populatedReport = await Report.findById(report._id).populate('reporter', 'name email');

    res.status(201).json({
      success: true,
      data: populatedReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
exports.getReports = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Report.countDocuments(query);

    res.json({
      success: true,
      data: reports,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('reporter', 'name email phone');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's reports
// @route   GET /api/reports/my-reports
// @access  Private
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private (Admin/Staff)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, adminNotes, priority, assignedAgency } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    const oldStatus = report.status;
    report.status = status || report.status;
    report.priority = priority || report.priority;
    report.adminNotes = adminNotes || report.adminNotes;
    
    // Update assigned agency if provided
    if (assignedAgency !== undefined) {
      report.assignedAgency = assignedAgency || null;
    }

    // Add to status history if status changed
    if (status && oldStatus !== status) {
      report.statusHistory.push({
        status: status,
        assignedAgency: report.assignedAgency,
        remarks: adminNotes || `Status changed to ${status}`,
        updatedBy: req.user._id,
        timestamp: new Date()
      });
    }

    if (status === 'resolved') {
      report.resolvedAt = Date.now();
    }

    await report.save();

    const updatedReport = await Report.findById(report._id)
      .populate('reporter', 'name email');

    // Send push notification to reporter if status changed
    if (oldStatus !== status && report.reporter) {
      try {
        const reporter = await User.findById(report.reporter);
        if (reporter && reporter.pushToken) {
          const { title, body } = getNotificationContent(
            status,
            report.title,
            adminNotes,
            report.assignedAgency
          );
          
          await sendPushNotification(
            reporter.pushToken,
            title,
            body,
            {
              reportId: report._id.toString(),
              status: status,
              type: 'status_update',
              assignedAgency: report.assignedAgency,
              hasRemarks: !!adminNotes
            }
          );
        }
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail the status update if notification fails
      }
    }

    res.json({
      success: true,
      data: updatedReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reports for heatmap
// @route   GET /api/reports/heatmap
// @access  Public
exports.getHeatmapData = async (req, res) => {
  try {
    const reports = await Report.find({ status: { $ne: 'resolved' } })
      .select('location category status priority');

    const heatmapData = reports.map(report => ({
      latitude: report.location.coordinates[1],
      longitude: report.location.coordinates[0],
      category: report.category,
      status: report.status,
      priority: report.priority
    }));

    res.json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get suggested categories based on text
// @route   POST /api/reports/suggest-category
// @access  Private
exports.getSuggestedCategories = async (req, res) => {
  try {
    const { text } = req.body;
    const { getSuggestedCategories } = require('../utils/categoryClassifier');
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const suggestions = getSuggestedCategories(text, 3);

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

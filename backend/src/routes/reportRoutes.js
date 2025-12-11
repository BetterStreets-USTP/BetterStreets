const express = require('express');
const {
  createReport,
  getReports,
  getReport,
  getMyReports,
  updateReportStatus,
  getHeatmapData,
  getSuggestedCategories,
  deleteReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getReports);
router.get('/heatmap', getHeatmapData);
router.get('/:id', getReport);

// Protected routes
router.post('/', protect, upload.array('photos', 5), createReport);
router.post('/suggest-category', protect, getSuggestedCategories);
router.get('/user/my-reports', protect, getMyReports);

// Admin only routes
router.put('/:id/status', protect, authorize('admin'), updateReportStatus);
router.delete('/:id', protect, authorize('admin'), deleteReport);

module.exports = router;

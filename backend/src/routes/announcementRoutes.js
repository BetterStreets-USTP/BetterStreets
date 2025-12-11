const express = require('express');
const {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);

// Protected routes (Admin/Staff only)
router.post(
  '/',
  protect,
  authorize('barangay_staff', 'admin'),
  createAnnouncement
);
router.put(
  '/:id',
  protect,
  authorize('barangay_staff', 'admin'),
  updateAnnouncement
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  deleteAnnouncement
);

module.exports = router;

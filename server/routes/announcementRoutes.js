const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    approveAnnouncement,
    getAnnouncementStats  // Add this line
} = require('../controllers/announcementController');

// Stats route - MUST come before the /:id route
router.get('/stats', protect, getAnnouncementStats);

// Routes
router.route('/')
    .get(protect, getAnnouncements)
    .post(protect, createAnnouncement);

router.route('/:id')
    .get(protect, getAnnouncement)
    .put(protect, updateAnnouncement)
    .delete(protect, deleteAnnouncement);

// Admin only route
router.put('/:id/approve', protect, authorize('admin'), approveAnnouncement);

module.exports = router;
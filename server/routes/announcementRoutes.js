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
    getAnnouncementStats
} = require('../controllers/announcementController');

// ✅ Search route - add this BEFORE /:id
router.get('/search', protect, async (req, res) => {
    try {
        const { q } = req.query;
        const db = require('../config/database');
        
        const result = await db.query(
            `SELECT * FROM announcements 
             WHERE title ILIKE $1 OR content ILIKE $1
             ORDER BY created_at DESC`,
            [`%${q}%`]
        );
        
        res.json({ success: true, announcements: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Stats route
router.get('/stats', protect, getAnnouncementStats);

// Main routes
router.route('/')
    .get(protect, getAnnouncements)
    .post(protect, createAnnouncement);

// This must come LAST
router.route('/:id')
    .get(protect, getAnnouncement)
    .put(protect, updateAnnouncement)
    .delete(protect, deleteAnnouncement);

// Admin only route
router.put('/:id/approve', protect, authorize('admin'), approveAnnouncement);

module.exports = router;
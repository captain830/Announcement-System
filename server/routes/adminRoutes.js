const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const db = require('../config/database');

// Get all users (admin only)
router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, email, role, department, year, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, users: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get pending announcements
router.get('/pending-announcements', protect, authorize('admin'), async (req, res) => {
    try {
        const result = await db.query(
            `SELECT a.*, u.name as creator_name 
             FROM announcements a 
             LEFT JOIN users u ON a.created_by = u.id 
             WHERE a.status = 'pending' 
             ORDER BY a.created_at DESC`
        );
        res.json({ success: true, announcements: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get system stats
router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const [usersCount, announcementsCount, commentsCount, viewsCount] = await Promise.all([
            db.query('SELECT COUNT(*) FROM users'),
            db.query('SELECT COUNT(*) FROM announcements'),
            db.query('SELECT COUNT(*) FROM comments'),
            db.query('SELECT SUM(views) FROM announcements')
        ]);
        
        res.json({
            success: true,
            stats: {
                totalUsers: parseInt(usersCount.rows[0].count),
                totalAnnouncements: parseInt(announcementsCount.rows[0].count),
                totalComments: parseInt(commentsCount.rows[0].count),
                totalViews: parseInt(viewsCount.rows[0].count) || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete user
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update user role
router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
        res.json({ success: true, message: 'Role updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
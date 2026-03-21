const Announcement = require('../models/Announcement');
const db = require('../config/database'); // Add this import

// @desc    Get all announcements
const getAnnouncements = async (req, res) => {
    try {
        const { category, priority } = req.query;
        const filters = { category, priority };
        
        const announcements = await Announcement.findAll(filters);
        
        res.json({
            success: true,
            count: announcements.length,
            announcements
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single announcement
const getAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }
        
        await Announcement.incrementView(req.params.id, req.user.id);
        
        res.json({
            success: true,
            announcement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create announcement
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, category, priority, expiry_date } = req.body;
        
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }
        
        const announcement = await Announcement.create({
            title,
            content,
            category: category || 'general',
            priority: priority || 'low',
            file_url: req.file ? req.file.path : null,
            created_by: req.user.id,
            expiry_date
        });
        
        res.status(201).json({
            success: true,
            announcement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update announcement
const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }
        
        if (req.user.role !== 'admin' && announcement.created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this announcement'
            });
        }
        
        const updated = await Announcement.update(req.params.id, req.body);
        
        res.json({
            success: true,
            announcement: updated
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete announcement
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        
        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }
        
        if (req.user.role !== 'admin' && announcement.created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this announcement'
            });
        }
        
        await Announcement.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Approve announcement (admin only)
const approveAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.update(req.params.id, {
            status: 'approved',
            approved_by: req.user.id
        });
        
        res.json({
            success: true,
            announcement
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get announcement stats
const getAnnouncementStats = async (req, res) => {
    try {
        // Get total announcements
        const totalResult = await db.query('SELECT COUNT(*) FROM announcements');
        
        // Get total views
        const viewsResult = await db.query('SELECT COALESCE(SUM(views), 0) FROM announcements');
        
        // Get total comments
        let commentsCount = 0;
        try {
            const commentsResult = await db.query('SELECT COUNT(*) FROM comments');
            commentsCount = parseInt(commentsResult.rows[0].count);
        } catch (e) {
            console.log('Comments table not found');
        }
        
        res.json({
            success: true,
            stats: {
                total: parseInt(totalResult.rows[0].count),
                views: parseInt(viewsResult.rows[0].coalesce),
                comments: commentsCount
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = {
    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    approveAnnouncement,
    getAnnouncementStats  // Add this to exports
};
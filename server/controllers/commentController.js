const db = require('../config/database');

// Add a comment
const addComment = async (req, res) => {
    try {
        const { announcement_id } = req.params;
        const { comment } = req.body;
        const user_id = req.user.id;

        console.log('Adding comment:', { announcement_id, user_id, comment });

        if (!comment || comment.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot be empty'
            });
        }

        // Check if announcement exists
        const announcementCheck = await db.query(
            'SELECT id FROM announcements WHERE id = $1',
            [announcement_id]
        );

        if (announcementCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Insert comment
        const query = `
            INSERT INTO comments (announcement_id, user_id, comment)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const result = await db.query(query, [announcement_id, user_id, comment]);

        // Get user name
        const userQuery = 'SELECT name FROM users WHERE id = $1';
        const userResult = await db.query(userQuery, [user_id]);

        res.json({
            success: true,
            comment: {
                ...result.rows[0],
                user_name: userResult.rows[0]?.name || 'Unknown'
            }
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get comments for an announcement
const getComments = async (req, res) => {
    try {
        const { announcement_id } = req.params;

        const query = `
            SELECT c.*, u.name as user_name
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.announcement_id = $1
            ORDER BY c.created_at DESC
        `;

        const result = await db.query(query, [announcement_id]);

        res.json({
            success: true,
            comments: result.rows
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { addComment, getComments };
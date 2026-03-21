const db = require('../config/database');

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, department, year } = req.body;
        const userId = req.user.id;

        // Check if email is already taken by another user
        if (email) {
            const emailCheck = await db.query(
                'SELECT id FROM users WHERE email = $1 AND id != $2',
                [email, userId]
            );
            if (emailCheck.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use by another account'
                });
            }
        }

        // Update user profile
        const query = `
            UPDATE users 
            SET name = COALESCE($1, name),
                email = COALESCE($2, email),
                department = COALESCE($3, department),
                year = COALESCE($4, year),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING id, name, email, role, department, year, created_at
        `;

        const values = [name, email, department, year, userId];
        const result = await db.query(query, values);

        res.json({
            success: true,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get user stats (for dashboard)
const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user's announcements count
        const announcementsCount = await db.query(
            'SELECT COUNT(*) FROM announcements WHERE created_by = $1',
            [userId]
        );

        // Get user's comments count
        const commentsCount = await db.query(
            'SELECT COUNT(*) FROM comments WHERE user_id = $1',
            [userId]
        );

        res.json({
            success: true,
            stats: {
                announcements: parseInt(announcementsCount.rows[0].count),
                comments: parseInt(commentsCount.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { updateProfile, getUserStats };
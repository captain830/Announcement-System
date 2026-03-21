const db = require('../config/database');

class Announcement {
    static async create(announcementData) {
        const {
            title, content, category, priority,
            file_url, created_by, expiry_date
        } = announcementData;

        const query = `
            INSERT INTO announcements 
            (title, content, category, priority, file_url, created_by, expiry_date, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const status = priority === 'high' ? 'pending' : 'approved';
        const values = [title, content, category, priority, file_url, created_by, expiry_date, status];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findAll(filters = {}) {
        let query = `
            SELECT a.*, u.name as creator_name, u.role as creator_role,
                   COUNT(DISTINCT c.id) as comment_count
            FROM announcements a
            LEFT JOIN users u ON a.created_by = u.id
            LEFT JOIN comments c ON a.id = c.announcement_id
            WHERE 1=1
        `;
        
        const values = [];
        let paramCount = 1;

        if (filters.status) {
            query += ` AND a.status = $${paramCount}`;
            values.push(filters.status);
            paramCount++;
        }

        if (filters.category && filters.category !== 'all') {
            query += ` AND a.category = $${paramCount}`;
            values.push(filters.category);
            paramCount++;
        }

        if (filters.priority) {
            query += ` AND a.priority = $${paramCount}`;
            values.push(filters.priority);
            paramCount++;
        }

        query += ` GROUP BY a.id, u.id ORDER BY a.is_pinned DESC, a.created_at DESC LIMIT 50`;

        const result = await db.query(query, values);
        return result.rows;
    }

    static async findById(id) {
        const query = `
            SELECT a.*, u.name as creator_name, u.role as creator_role
            FROM announcements a
            LEFT JOIN users u ON a.created_by = u.id
            WHERE a.id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async update(id, announcementData) {
        const { title, content, category, priority, file_url, status, approved_by } = announcementData;

        const query = `
            UPDATE announcements 
            SET title = COALESCE($1, title),
                content = COALESCE($2, content),
                category = COALESCE($3, category),
                priority = COALESCE($4, priority),
                file_url = COALESCE($5, file_url),
                status = COALESCE($6, status),
                approved_by = COALESCE($7, approved_by),
                approved_at = CASE WHEN $6 = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END
            WHERE id = $8
            RETURNING *
        `;

        const values = [title, content, category, priority, file_url, status, approved_by, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM announcements WHERE id = $1 RETURNING id';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async incrementView(id, userId) {
        const checkQuery = 'SELECT id FROM announcement_views WHERE announcement_id = $1 AND user_id = $2';
        const checkResult = await db.query(checkQuery, [id, userId]);

        if (checkResult.rows.length === 0) {
            await db.query(
                'INSERT INTO announcement_views (announcement_id, user_id) VALUES ($1, $2)',
                [id, userId]
            );
            
            await db.query(
                'UPDATE announcements SET views = views + 1 WHERE id = $1',
                [id]
            );
        }
    }
}

module.exports = Announcement;
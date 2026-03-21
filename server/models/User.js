const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { name, email, password, role = 'student', department, year } = userData;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = `
            INSERT INTO users (name, email, password, role, department, year)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, name, email, role, department, year, created_at
        `;
        
        const values = [name, email, hashedPassword, role, department, year];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = `
            SELECT id, name, email, role, department, year, profile_pic, is_active, created_at
            FROM users WHERE id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;
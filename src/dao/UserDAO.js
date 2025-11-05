const pool = require('../config/database');
const User = require('../models/User');

class UserDAO {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows.map(row => new User(row));
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows.length > 0 ? new User(rows[0]) : null;
    }

    async findByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length > 0 ? new User(rows[0]) : null;
    }

    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows.length > 0 ? new User(rows[0]) : null;
    }

    async create(userData) {
        const { username, email, password } = userData;
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        return this.findById(result.insertId);
    }

    async update(id, userData) {
        const fields = [];
        const values = [];

        if (userData.username) {
            fields.push('username = ?');
            values.push(userData.username);
        }
        if (userData.email) {
            fields.push('email = ?');
            values.push(userData.email);
        }
        if (userData.password) {
            fields.push('password = ?');
            values.push(userData.password);
        }

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new UserDAO();


const pool = require('../config/database');
const Poem = require('../models/Poem');

class PoemDAO {
    async findAll() {
        const [rows] = await pool.query(`
            SELECT pm.*, b.title as book_title, p.name as poet_name 
            FROM poems pm 
            LEFT JOIN books b ON pm.book_id = b.id 
            LEFT JOIN poets p ON b.poet_id = p.id 
            ORDER BY pm.title
        `);
        return rows.map(row => new Poem(row));
    }

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT pm.*, b.title as book_title, p.name as poet_name 
            FROM poems pm 
            LEFT JOIN books b ON pm.book_id = b.id 
            LEFT JOIN poets p ON b.poet_id = p.id 
            WHERE pm.id = ?
        `, [id]);
        return rows.length > 0 ? new Poem(rows[0]) : null;
    }

    async findByBookId(bookId) {
        const [rows] = await pool.query('SELECT * FROM poems WHERE book_id = ?', [bookId]);
        return rows.map(row => new Poem(row));
    }

    async findByTitleAndBook(title, bookId) {
        const [rows] = await pool.query('SELECT * FROM poems WHERE title = ? AND book_id = ? LIMIT 1', [title, bookId]);
        return rows.length > 0 ? new Poem(rows[0]) : null;
    }

    async findByTheme(theme) {
        const [rows] = await pool.query('SELECT * FROM poems WHERE theme LIKE ?', [`%${theme}%`]);
        return rows.map(row => new Poem(row));
    }

    async findByStyle(style) {
        const [rows] = await pool.query('SELECT * FROM poems WHERE style = ?', [style]);
        return rows.map(row => new Poem(row));
    }

    async create(poemData) {
        const { title, book_id, content, page_number, verses_count, stanzas_count, style, theme, notes } = poemData;
        const [result] = await pool.query(
            `INSERT INTO poems (title, book_id, content, page_number, verses_count, stanzas_count, style, theme, notes) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, book_id, content, page_number, verses_count, stanzas_count, style, theme, notes]
        );
        return this.findById(result.insertId);
    }

    async update(id, poemData) {
        const fields = [];
        const values = [];

        const allowedFields = ['title', 'book_id', 'content', 'page_number', 'verses_count', 'stanzas_count', 'style', 'theme', 'notes'];

        allowedFields.forEach(field => {
            if (poemData[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(poemData[field]);
            }
        });

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(
            `UPDATE poems SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM poems WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new PoemDAO();

const pool = require('../config/database');
const Book = require('../models/Book');

class BookDAO {
    async findAll() {
        const [rows] = await pool.query(`
            SELECT b.*, p.name as poet_name 
            FROM books b 
            LEFT JOIN poets p ON b.poet_id = p.id 
            ORDER BY b.title
        `);
        return rows.map(row => new Book(row));
    }

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT b.*, p.name as poet_name 
            FROM books b 
            LEFT JOIN poets p ON b.poet_id = p.id 
            WHERE b.id = ?
        `, [id]);
        return rows.length > 0 ? new Book(rows[0]) : null;
    }

    async findByPoetId(poetId) {
        const [rows] = await pool.query('SELECT * FROM books WHERE poet_id = ?', [poetId]);
        return rows.map(row => new Book(row));
    }

    async findByTitleAndPoet(title, poetId) {
        const [rows] = await pool.query('SELECT * FROM books WHERE title = ? AND poet_id = ? LIMIT 1', [title, poetId]);
        return rows.length > 0 ? new Book(rows[0]) : null;
    }

    async findByIsbn(isbn) {
        const [rows] = await pool.query('SELECT * FROM books WHERE isbn = ?', [isbn]);
        return rows.length > 0 ? new Book(rows[0]) : null;
    }

    async create(bookData) {
        const { title, poet_id, isbn, publication_year, publisher, pages, language, edition, description, cover_url } = bookData;
        const [result] = await pool.query(
            `INSERT INTO books (title, poet_id, isbn, publication_year, publisher, pages, language, edition, description, cover_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, poet_id, isbn, publication_year, publisher, pages, language, edition, description, cover_url]
        );
        return this.findById(result.insertId);
    }

    async update(id, bookData) {
        const fields = [];
        const values = [];

        const allowedFields = ['title', 'poet_id', 'isbn', 'publication_year', 'publisher', 'pages', 'language', 'edition', 'description', 'cover_url'];

        allowedFields.forEach(field => {
            if (bookData[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(bookData[field]);
            }
        });

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(
            `UPDATE books SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async getBookWithPoems(id) {
        const [books] = await pool.query(`
            SELECT b.*, p.name as poet_name 
            FROM books b 
            LEFT JOIN poets p ON b.poet_id = p.id 
            WHERE b.id = ?
        `, [id]);

        if (books.length === 0) return null;

        const [poems] = await pool.query('SELECT * FROM poems WHERE book_id = ?', [id]);

        const book = new Book(books[0]);
        return { ...book, poems };
    }
}

module.exports = new BookDAO();

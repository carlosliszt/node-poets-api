const pool = require('../config/database');
const Poet = require('../models/Poet');

class PoetDAO {
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM poets ORDER BY name');
        return rows.map(row => new Poet(row));
    }

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM poets WHERE id = ?', [id]);
        return rows.length > 0 ? new Poet(rows[0]) : null;
    }

    async findByNationality(nationality) {
        const [rows] = await pool.query('SELECT * FROM poets WHERE nationality = ?', [nationality]);
        return rows.map(row => new Poet(row));
    }

    async findByMovement(movement) {
        const [rows] = await pool.query('SELECT * FROM poets WHERE literary_movement = ?', [movement]);
        return rows.map(row => new Poet(row));
    }

    async findByName(name) {
        const [rows] = await pool.query('SELECT * FROM poets WHERE name = ? LIMIT 1', [name]);
        return rows.length > 0 ? new Poet(rows[0]) : null;
    }

    async findByPseudonym(pseudonym) {
        const [rows] = await pool.query('SELECT * FROM poets WHERE pseudonym = ? LIMIT 1', [pseudonym]);
        return rows.length > 0 ? new Poet(rows[0]) : null;
    }

    async create(poetData) {
        const { name, pseudonym, birth_year, death_year, nationality, literary_movement, biography, photo_url } = poetData;
        const [result] = await pool.query(
            `INSERT INTO poets (name, pseudonym, birth_year, death_year, nationality, literary_movement, biography, photo_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, pseudonym, birth_year, death_year, nationality, literary_movement, biography, photo_url]
        );
        return this.findById(result.insertId);
    }

    async update(id, poetData) {
        const fields = [];
        const values = [];

        const allowedFields = ['name', 'pseudonym', 'birth_year', 'death_year', 'nationality', 'literary_movement', 'biography', 'photo_url'];

        allowedFields.forEach(field => {
            if (poetData[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(poetData[field]);
            }
        });

        if (fields.length === 0) return this.findById(id);

        values.push(id);
        await pool.query(
            `UPDATE poets SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return this.findById(id);
    }

    async delete(id) {
        const [result] = await pool.query('DELETE FROM poets WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    async getPoetWithBooks(id) {
        const [poets] = await pool.query('SELECT * FROM poets WHERE id = ?', [id]);
        if (poets.length === 0) return null;

        const [books] = await pool.query('SELECT * FROM books WHERE poet_id = ?', [id]);

        const poet = new Poet(poets[0]);
        return { ...poet, books };
    }
}

module.exports = new PoetDAO();

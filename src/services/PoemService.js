const PoemDAO = require('../dao/PoemDAO');
const BookDAO = require('../dao/BookDAO');
const PoetDAO = require('../dao/PoetDAO');

class PoemService {
    async getAllPoems() {
        return await PoemDAO.findAll();
    }

    async getPoemById(id) {
        const poem = await PoemDAO.findById(id);
        if (!poem) {
            throw new Error('Poema não encontrado');
        }
        return poem;
    }

    async getPoemsByBookId(bookId) {
        return await PoemDAO.findByBookId(bookId);
    }

    async getPoemsByTheme(theme) {
        return await PoemDAO.findByTheme(theme);
    }

    async getPoemsByStyle(style) {
        return await PoemDAO.findByStyle(style);
    }

    async createPoem(poemData) {
        const book = await BookDAO.findById(poemData.book_id);
        if (!book) {
            throw new Error('Livro não encontrado');
        }

        if (book.poet_id) {
            const poet = await PoetDAO.findById(book.poet_id);
            if (!poet) {
                throw new Error('Poeta do livro não encontrado');
            }
        }

        if (poemData.title) {
            const existing = await PoemDAO.findByTitleAndBook(poemData.title, poemData.book_id);
            if (existing) {
                throw new Error('Já existe um poema com este título neste livro');
            }
        }

        return await PoemDAO.create(poemData);
    }

    async updatePoem(id, poemData) {
        const poem = await PoemDAO.findById(id);
        if (!poem) {
            throw new Error('Poema não encontrado');
        }

        if (poemData.book_id) {
            const book = await BookDAO.findById(poemData.book_id);
            if (!book) {
                throw new Error('Livro não encontrado');
            }

            if (book.poet_id) {
                const poet = await PoetDAO.findById(book.poet_id);
                if (!poet) {
                    throw new Error('Poeta do livro não encontrado');
                }
            }
        }

        const newTitle = poemData.title || poem.title;
        const newBookId = poemData.book_id || poem.book_id;
        const existing = await PoemDAO.findByTitleAndBook(newTitle, newBookId);
        if (existing && existing.id !== poem.id) {
            throw new Error('Já existe um poema com este título neste livro');
        }

        return await PoemDAO.update(id, poemData);
    }

    async deletePoem(id) {
        const deleted = await PoemDAO.delete(id);
        if (!deleted) {
            throw new Error('Poema não encontrado');
        }
        return deleted;
    }
}

module.exports = new PoemService();

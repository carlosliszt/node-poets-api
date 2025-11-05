const BookDAO = require('../dao/BookDAO');
const PoetDAO = require('../dao/PoetDAO');

class BookService {
    async getAllBooks() {
        return await BookDAO.findAll();
    }

    async getBookById(id) {
        const book = await BookDAO.findById(id);
        if (!book) {
            throw new Error('Livro não encontrado');
        }
        return book;
    }

    async getBooksByPoetId(poetId) {
        return await BookDAO.findByPoetId(poetId);
    }

    async createBook(bookData) {
        const poet = await PoetDAO.findById(bookData.poet_id);
        if (!poet) {
            throw new Error('Poeta não encontrado');
        }

        if (bookData.isbn) {
            const existingBook = await BookDAO.findByIsbn(bookData.isbn);
            if (existingBook) {
                throw new Error('ISBN já cadastrado');
            }
        }

        if (bookData.title) {
            const existingTitle = await BookDAO.findByTitleAndPoet(bookData.title, bookData.poet_id);
            if (existingTitle) {
                throw new Error('Já existe um livro com este título para o poeta informado');
            }
        }

        return await BookDAO.create(bookData);
    }

    async updateBook(id, bookData) {
        const book = await BookDAO.findById(id);
        if (!book) {
            throw new Error('Livro não encontrado');
        }

        if (bookData.poet_id) {
            const poet = await PoetDAO.findById(bookData.poet_id);
            if (!poet) {
                throw new Error('Poeta não encontrado');
            }
        }

        return await BookDAO.update(id, bookData);
    }

    async deleteBook(id) {
        const deleted = await BookDAO.delete(id);
        if (!deleted) {
            throw new Error('Livro não encontrado');
        }
        return deleted;
    }

    async getBookWithPoems(id) {
        const book = await BookDAO.getBookWithPoems(id);
        if (!book) {
            throw new Error('Livro não encontrado');
        }
        return book;
    }
}

module.exports = new BookService();

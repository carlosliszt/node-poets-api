const BookService = require('../services/BookService');

class BookController {
    async getAll(req, res, next) {
        try {
            const { poet_id } = req.query;

            let books;
            if (poet_id) {
                books = await BookService.getBooksByPoetId(poet_id);
            } else {
                books = await BookService.getAllBooks();
            }

            res.status(200).json({
                success: true,
                count: books.length,
                data: books
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const book = await BookService.getBookById(req.params.id);
            res.status(200).json({
                success: true,
                data: book
            });
        } catch (error) {
            next(error);
        }
    }

    async getWithPoems(req, res, next) {
        try {
            const book = await BookService.getBookWithPoems(req.params.id);
            res.status(200).json({
                success: true,
                data: book
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const book = await BookService.createBook(req.body);
            res.status(201).json({
                success: true,
                message: 'Livro criado com sucesso',
                data: book
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const book = await BookService.updateBook(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Livro atualizado com sucesso',
                data: book
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await BookService.deleteBook(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Livro deletado com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookController();


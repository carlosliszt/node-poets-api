const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');
const authMiddleware = require('../middlewares/authMiddleware');
const bookValidator = require('../validators/bookValidator');
const validate = require('../middlewares/validationMiddleware');

// Rotas públicas (leitura)
router.get('/', BookController.getAll);
router.get('/:id', BookController.getById);
router.get('/:id/poems', BookController.getWithPoems);

// Rotas protegidas (escrita)
router.post('/', authMiddleware, bookValidator, validate, BookController.create);
router.put('/:id', authMiddleware, bookValidator, validate, BookController.update);
router.delete('/:id', authMiddleware, BookController.delete);

module.exports = router;


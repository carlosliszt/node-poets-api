const express = require('express');
const router = express.Router();
const PoetController = require('../controllers/PoetController');
const authMiddleware = require('../middlewares/authMiddleware');
const poetValidator = require('../validators/poetValidator');
const validate = require('../middlewares/validationMiddleware');

// Rotas públicas (leitura)
router.get('/', PoetController.getAll);
router.get('/:id', PoetController.getById);
router.get('/:id/books', PoetController.getWithBooks);

// Rotas protegidas (escrita)
router.post('/', authMiddleware, poetValidator, validate, PoetController.create);
router.put('/:id', authMiddleware, poetValidator, validate, PoetController.update);
router.delete('/:id', authMiddleware, PoetController.delete);

module.exports = router;


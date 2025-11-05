const express = require('express');
const router = express.Router();
const PoemController = require('../controllers/PoemController');
const authMiddleware = require('../middlewares/authMiddleware');
const poemValidator = require('../validators/poemValidator');
const validate = require('../middlewares/validationMiddleware');

// Rotas públicas (leitura)
router.get('/', PoemController.getAll);
router.get('/:id', PoemController.getById);

// Rotas protegidas (escrita)
router.post('/', authMiddleware, poemValidator, validate, PoemController.create);
router.put('/:id', authMiddleware, poemValidator, validate, PoemController.update);
router.delete('/:id', authMiddleware, PoemController.delete);

module.exports = router;


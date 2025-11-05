const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');
const { registerValidator } = require('../validators/authValidator');
const validate = require('../middlewares/validationMiddleware');

// Todas as rotas de usuário são protegidas
router.use(authMiddleware);

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', registerValidator, validate, UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;


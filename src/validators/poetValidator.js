const { body } = require('express-validator');

const poetValidator = [
    body('name')
        .notEmpty().withMessage('Nome é obrigatório')
        .isLength({ max: 100 }).withMessage('Nome deve ter no máximo 100 caracteres'),

    body('pseudonym')
        .optional()
        .isLength({ max: 100 }).withMessage('Pseudônimo deve ter no máximo 100 caracteres'),

    body('birth_year')
        .optional()
        .isInt({ min: 0, max: new Date().getFullYear() }).withMessage('Ano de nascimento inválido'),

    body('death_year')
        .optional()
        .isInt({ min: 0, max: new Date().getFullYear() }).withMessage('Ano de falecimento inválido'),

    body('nationality')
        .optional()
        .isLength({ max: 50 }).withMessage('Nacionalidade deve ter no máximo 50 caracteres'),

    body('literary_movement')
        .optional()
        .isLength({ max: 100 }).withMessage('Movimento literário deve ter no máximo 100 caracteres'),

    body('biography')
        .optional()
        .isString().withMessage('Biografia deve ser texto'),

    body('photo_url')
        .optional()
        .isURL().withMessage('URL da foto inválida')
];

module.exports = poetValidator;


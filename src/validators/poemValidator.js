const { body } = require('express-validator');

const poemValidator = [
    body('title')
        .notEmpty().withMessage('Título é obrigatório')
        .isLength({ max: 200 }).withMessage('Título deve ter no máximo 200 caracteres'),

    body('book_id')
        .notEmpty().withMessage('ID do livro é obrigatório')
        .isInt({ min: 1 }).withMessage('ID do livro inválido'),

    body('content')
        .notEmpty().withMessage('Conteúdo é obrigatório')
        .isString().withMessage('Conteúdo deve ser texto'),

    body('page_number')
        .optional()
        .isInt({ min: 1 }).withMessage('Número da página inválido'),

    body('verses_count')
        .optional()
        .isInt({ min: 1 }).withMessage('Contagem de versos inválida'),

    body('stanzas_count')
        .optional()
        .isInt({ min: 1 }).withMessage('Contagem de estrofes inválida'),

    body('style')
        .optional()
        .isLength({ max: 50 }).withMessage('Estilo deve ter no máximo 50 caracteres'),

    body('theme')
        .optional()
        .isLength({ max: 100 }).withMessage('Tema deve ter no máximo 100 caracteres'),

    body('notes')
        .optional()
        .isString().withMessage('Notas devem ser texto')
];

module.exports = poemValidator;


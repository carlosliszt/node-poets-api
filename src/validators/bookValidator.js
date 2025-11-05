const { body } = require('express-validator');

const bookValidator = [
    body('title')
        .notEmpty().withMessage('Título é obrigatório')
        .isLength({ max: 200 }).withMessage('Título deve ter no máximo 200 caracteres'),

    body('poet_id')
        .notEmpty().withMessage('ID do poeta é obrigatório')
        .isInt({ min: 1 }).withMessage('ID do poeta inválido'),

    body('isbn')
        .optional()
        .isLength({ max: 20 }).withMessage('ISBN deve ter no máximo 20 caracteres'),

    body('publication_year')
        .optional()
        .isInt({ min: 0, max: new Date().getFullYear() }).withMessage('Ano de publicação inválido'),

    body('publisher')
        .optional()
        .isLength({ max: 100 }).withMessage('Editora deve ter no máximo 100 caracteres'),

    body('pages')
        .optional()
        .isInt({ min: 1 }).withMessage('Número de páginas inválido'),

    body('language')
        .optional()
        .isLength({ max: 30 }).withMessage('Idioma deve ter no máximo 30 caracteres'),

    body('edition')
        .optional()
        .isInt({ min: 1 }).withMessage('Edição inválida'),

    body('description')
        .optional()
        .isString().withMessage('Descrição deve ser texto'),

    body('cover_url')
        .optional()
        .isURL().withMessage('URL da capa inválida')
];

module.exports = bookValidator;


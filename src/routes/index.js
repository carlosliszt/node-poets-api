const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const poetRoutes = require('./poetRoutes');
const bookRoutes = require('./bookRoutes');
const poemRoutes = require('./poemRoutes');

// root
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Poesias - Sistema de Gerenciamento de Poetas, Livros e Poemas',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            poets: '/api/poets',
            books: '/api/books',
            poems: '/api/poems'
        }
    });
});

// demais rotas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/poets', poetRoutes);
router.use('/books', bookRoutes);
router.use('/poems', poemRoutes);

module.exports = router;


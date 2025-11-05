const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('===========================================');
    console.log('🚀 Servidor rodando!');
    console.log(`📍 Porta: ${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL: http://localhost:${PORT}/api`);
    console.log('===========================================');
});


const errorMiddleware = (err, req, res, next) => {
    console.error('Erro:', err);

    // erro validação MySQL
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            message: 'Registro duplicado',
            error: err.message
        });
    }

    // erro foreign key
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
            success: false,
            message: 'Referência inválida',
            error: 'O registro relacionado não existe'
        });
    }

    // erro :P
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
};

module.exports = errorMiddleware;


const AuthService = require('../services/AuthService');

class AuthController {
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const result = await AuthService.register(username, email, password);

            res.status(201).json({
                success: true,
                message: 'Usuário registrado com sucesso',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const result = await AuthService.login(username, password);

            res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async me(req, res, next) {
        try {
            res.status(200).json({
                success: true,
                data: {
                    id: req.userId,
                    username: req.username
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();


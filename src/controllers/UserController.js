const UserService = require('../services/UserService');

class UserController {
    async getAll(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json({
                success: true,
                data: users.map(user => user.toJSON())
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.status(200).json({
                success: true,
                data: user.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json({
                success: true,
                message: 'Usuário criado com sucesso',
                data: user.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Usuário atualizado com sucesso',
                data: user.toJSON()
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await UserService.deleteUser(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Usuário deletado com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();


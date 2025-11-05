const PoetService = require('../services/PoetService');

class PoetController {
    async getAll(req, res, next) {
        try {
            const { nationality, movement } = req.query;

            let poets;
            if (nationality) {
                poets = await PoetService.getPoetsByNationality(nationality);
            } else if (movement) {
                poets = await PoetService.getPoetsByMovement(movement);
            } else {
                poets = await PoetService.getAllPoets();
            }

            res.status(200).json({
                success: true,
                count: poets.length,
                data: poets
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const poet = await PoetService.getPoetById(req.params.id);
            res.status(200).json({
                success: true,
                data: poet
            });
        } catch (error) {
            next(error);
        }
    }

    async getWithBooks(req, res, next) {
        try {
            const poet = await PoetService.getPoetWithBooks(req.params.id);
            res.status(200).json({
                success: true,
                data: poet
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const poet = await PoetService.createPoet(req.body);
            res.status(201).json({
                success: true,
                message: 'Poeta criado com sucesso',
                data: poet
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const poet = await PoetService.updatePoet(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Poeta atualizado com sucesso',
                data: poet
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await PoetService.deletePoet(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Poeta deletado com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PoetController();


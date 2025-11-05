const PoemService = require('../services/PoemService');

class PoemController {
    async getAll(req, res, next) {
        try {
            const { book_id, theme, style } = req.query;

            let poems;
            if (book_id) {
                poems = await PoemService.getPoemsByBookId(book_id);
            } else if (theme) {
                poems = await PoemService.getPoemsByTheme(theme);
            } else if (style) {
                poems = await PoemService.getPoemsByStyle(style);
            } else {
                poems = await PoemService.getAllPoems();
            }

            res.status(200).json({
                success: true,
                count: poems.length,
                data: poems
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const poem = await PoemService.getPoemById(req.params.id);
            res.status(200).json({
                success: true,
                data: poem
            });
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const poem = await PoemService.createPoem(req.body);
            res.status(201).json({
                success: true,
                message: 'Poema criado com sucesso',
                data: poem
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const poem = await PoemService.updatePoem(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Poema atualizado com sucesso',
                data: poem
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await PoemService.deletePoem(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Poema deletado com sucesso'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PoemController();


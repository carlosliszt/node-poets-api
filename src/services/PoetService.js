const PoetDAO = require('../dao/PoetDAO');

class PoetService {
    async getAllPoets() {
        return await PoetDAO.findAll();
    }

    async getPoetById(id) {
        const poet = await PoetDAO.findById(id);
        if (!poet) {
            throw new Error('Poeta não encontrado');
        }
        return poet;
    }

    async getPoetsByNationality(nationality) {
        return await PoetDAO.findByNationality(nationality);
    }

    async getPoetsByMovement(movement) {
        return await PoetDAO.findByMovement(movement);
    }

    async createPoet(poetData) {
        if (poetData.name) {
            const existing = await PoetDAO.findByName(poetData.name);
            if (existing) {
                throw new Error('Já existe um poeta com este nome');
            }
        }

        if (poetData.pseudonym) {
            const existingPseudo = await PoetDAO.findByPseudonym(poetData.pseudonym);
            if (existingPseudo) {
                throw new Error('Já existe um poeta com este pseudônimo');
            }
        }

        return await PoetDAO.create(poetData);
    }

    async updatePoet(id, poetData) {
        const poet = await PoetDAO.findById(id);
        if (!poet) {
            throw new Error('Poeta não encontrado');
        }
        return await PoetDAO.update(id, poetData);
    }

    async deletePoet(id) {
        const deleted = await PoetDAO.delete(id);
        if (!deleted) {
            throw new Error('Poeta não encontrado');
        }
        return deleted;
    }

    async getPoetWithBooks(id) {
        const poet = await PoetDAO.getPoetWithBooks(id);
        if (!poet) {
            throw new Error('Poeta não encontrado');
        }
        return poet;
    }
}

module.exports = new PoetService();

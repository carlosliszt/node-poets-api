const bcrypt = require('bcryptjs');
const UserDAO = require('../dao/UserDAO');

class UserService {
    async getAllUsers() {
        return await UserDAO.findAll();
    }

    async getUserById(id) {
        const user = await UserDAO.findById(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return user;
    }

    async createUser(userData) {
        const { username, email, password } = userData;

        if (await UserDAO.findByUsername(username)) {
            throw new Error('Username já existe');
        }

        if (email && await UserDAO.findByEmail(email)) {
            throw new Error('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await UserDAO.create({ username, email, password: hashedPassword });
    }

    async updateUser(id, userData) {
        const user = await UserDAO.findById(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        return await UserDAO.update(id, userData);
    }

    async deleteUser(id) {
        const deleted = await UserDAO.delete(id);
        if (!deleted) {
            throw new Error('Usuário não encontrado');
        }
        return deleted;
    }
}

module.exports = new UserService();


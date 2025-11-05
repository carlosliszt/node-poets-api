const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserDAO = require('../dao/UserDAO');

class AuthService {
    async register(username, email, password) {
        // Verificar se usuário já existe
        const existingUser = await UserDAO.findByUsername(username);
        if (existingUser) {
            throw new Error('Usuário já existe');
        }

        if (email) {
            const existingEmail = await UserDAO.findByEmail(email);
            if (existingEmail) {
                throw new Error('Email já cadastrado');
            }
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await UserDAO.create({
            username,
            email,
            password: hashedPassword
        });

        // Gerar token
        const token = this.generateToken(user);

        return { user: user.toJSON(), token };
    }

    async login(username, password) {
        // Buscar usuário
        const user = await UserDAO.findByUsername(username);
        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Credenciais inválidas');
        }

        // Gerar token
        const token = this.generateToken(user);

        return { user: user.toJSON(), token };
    }

    generateToken(user) {
        return jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido');
        }
    }
}

module.exports = new AuthService();


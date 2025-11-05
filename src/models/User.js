class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // removendo senha
    toJSON() {
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }
}

module.exports = User;


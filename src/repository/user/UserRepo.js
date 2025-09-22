const User = require('./User');  // Adjust the path based on your folder structure

const UserRepo = {
    // Method to create a new user
    async create(user) {
        return User.create(user);
    },

    // Method to find a user by email
    async findByEmail(email) {
        return await User.findOne({
            where: { email: email.trim() }
        });
    },

    async getRoles(id) {
        const role = await User.findOne({
            where: { id }
        });
        return role ? role.role : null;
    },

    async getAllUsers() {
        return await User.findAll();
    }
};

module.exports = UserRepo;

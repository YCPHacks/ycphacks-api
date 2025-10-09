<<<<<<< Updated upstream
const { User } = require('../config/Models');  // Adjust the path based on your folder structure
=======
<<<<<<< HEAD
const User = require('./User');  // Adjust the path based on your folder structure
=======
const { User } = require('../config/Models');  // Adjust the path based on your folder structure
>>>>>>> sponsors
>>>>>>> Stashed changes

const UserRepo = {
    // Method to create a new user
    async create(user) {
        return User.create(user);
    },

    // Method to find a user by email
    async findByEmail(email) {
        return await User.findOne({
            where: { email }
        });
    },

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
=======
>>>>>>> Stashed changes
    async getRoles(id) {
        const role = await User.findOne({
            where: { id }
        });
        return role ? role.role : null;
    },

<<<<<<< Updated upstream
=======
>>>>>>> sponsors
>>>>>>> Stashed changes
    async getAllUsers() {
        return await User.findAll();
    }
};

module.exports = UserRepo;

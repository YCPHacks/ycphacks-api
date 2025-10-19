const { User } = require('../config/Models');  // Adjust the path based on your folder structure

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
    async getAllUsers() {
        return await User.findAll();
    },

    async updateCheckInStatus(userId, checkInStatus){
        const user = await User.findByPk(userId);

        if(!user){
            const error = new Error(`User with ID ${userId} not found.`);
            error.status = 404;
            throw error;
        }

        user.checkIn = checkInStatus;

        await user.save();
        return user;
    }
};

module.exports = UserRepo;

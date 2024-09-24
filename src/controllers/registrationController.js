const Registration = require('../models/Registration');

const registerUser = async (req, res) => {
    try {
        const registration = await Registration.create(req.body);
        res.status(201).json({ message: 'Registration successful', data: registration });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
};

const getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.findAll();
        res.status(200).json(registrations);
    } catch (err) {
        console.error('Error fetching registrations:', err);
        res.status(500).json({ message: 'Error fetching registrations' });
    }
};

const updateRegistrationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const registration = await Registration.findByPk(id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        registration.status = status;
        await registration.save();

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (err) {
        console.error('Error updating status:', err);
        res.status(500).json({ message: 'Error updating status' });
    }
};

const deleteRegistration = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Registration.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        res.status(200).json({ message: 'Registration deleted successfully' });
    } catch (err) {
        console.error('Error deleting registration:', err);
        res.status(500).json({ message: 'Error deleting registration' });
    }
};

module.exports = {
    registerUser,
    getRegistrations,
    updateRegistrationStatus,
    deleteRegistration,
};

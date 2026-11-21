const PermissionsRepo = require("../repository/permissions/PermissionsRepo");
const PermissionsDto = require("../dto/PermissionsDto")
const PermissionsController = {
    async createPermission(req, res) {
        try {
            console.log(req.body);
            const newPermission = await PermissionsRepo.createPermission({
                participantId: req.body.participantId,
                permission: req.body.permission
            });

            res.status(201).json({
                message: 'Create Permission successful',
                permission: newPermission});
        } catch (err) {
            res.status(500).json({ message: 'Error persisting permissions in database', error: err });
        }
    },

    async getAllPermissionsByEventId(req, res) {
        const eventId = req.query.eventId;
        try {
            const permissions = await PermissionsRepo.findAllPermissionsForEvent(eventId);

            res.status(200).json({data: permissions});
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch permissions'});
        }
    },

    async updatePermissions(req, res) {
        const {participantId} = req.params;
        const {permissions} = req.body;

        if (!participantId || !Array.isArray(permissions)) {
            return res.status(400).json({ message: 'Missing ParticipantId or permissions array'});
        }

        try {
            const result = await PermissionsRepo.updatePermissionsById(participantId, permissions);
            return res.status(200).json({ ...result, message: 'Permissions updated'});
        } catch (err) {
            console.error('Error updating permissions', err);
            return res.status(500).json({ message: 'Server error updating permissions' });
        }
    }
}

module.exports = PermissionsController;
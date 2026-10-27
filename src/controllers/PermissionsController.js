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
    }
}

module.exports = PermissionsController;
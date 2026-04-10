const JWTUtil = require('../util/JWTUtil');

// Used for protected routes
function authToken(req, res, next) {
        const authHeader = req.headers.authorization;
        //Expecting bearer token format
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({message: 'Authorization header missing or malformed'});
        }

        const token = authHeader.split(' ')[1];

        try {
            const validation = JWTUtil.validateToken(token);

            if (!validation.valid || !validation) {
                console.error("Auth Middleware: Token validation failed", validation?.error);
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            req.user = validation.decoded;  // Attach decoded token data to request
            next();  // Proceed to next middleware or route handler
        } catch (err){
            console.error("Auth Middleware: Critical error during validation", err);
            return res.status(500).json({ message: 'Authentication service error' });
        }

}

// Check the user role inside the token payload
const authorizeByRole = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req.user || !req.user.role){
            return res.status(401).json({ Message: 'User role not found' });
        }

        const hasRequiredRole = allowedRoles.includes(req.user.role);

        if(!hasRequiredRole){
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions'} );
        }

        // Participants are always only allowed to make changes and get info for their own account
        if(req.user.role === 'participant' ){
            if(!req.user || !req.user.id){
                return res.status(401).json({ Message: 'User id not found'});
            }

            if(req.params.id !== String(req.user.id)){
                return res.status(403).json({ message: 'Forbidden: You cannot access another users info'});
            }
        }
        next();
    };
};

// Check the user email inside the token payload


// Anyone using a route containing this function will only be able to change their own info
const isOwnerOfRequestedId = (req, res, next) => {
    if(!req.user || !req.user.id){
        return res.status(401).json({ Message: 'User id not found'});
    }

    if(req.params.id !== String(req.user.id)){
        return res.status(403).json({ message: 'Forbidden: You cannot access another users info TESTNG'});
    }
    next();
}

module.exports = {
    authToken, authorizeByRole, isOwnerOfRequestedId
}
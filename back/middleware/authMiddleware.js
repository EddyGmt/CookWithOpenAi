const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require('../db/models/user.model');
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log('DECODED TEST', decoded);

            // Get user from the token
            req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
            console.log('EST CE NOTRE USER', req.user);
            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }

})

// User must be an admin
const admin = (req, res, next) => {

    if (req.user && req.user.IsAdmin) {
        console.log(req.user.IsAdmin);
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }

}


// User must be an admin
module.exports = { protect, admin }

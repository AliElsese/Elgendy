const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const UserModel = require('../models/user-model');

const generateToken = (payload) => {
    return jwt.sign({userId: payload} , process.env.JWT_SECRET_KEY , {
        expiresIn: process.env.JWT_EXPIRE_TIME
    });
}

module.exports = {
    userLogin : asyncHandler(async (req , res , next) => {
        const user = await UserModel.findOne({ username: req.body.username });
        if(!user || !(await bcrypt.compare(req.body.password, user.password))) {
            next(new ApiError('Username Or Password Is Incorrect' , 401));
        }
        else {
            const token = generateToken(user._id);
            res.status(200).json({ data: user , token });
        }
    }),

    checkToken : asyncHandler(async (req , res , next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(new ApiError('Please login to access this route'), 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const currentUser = await UserModel.findById(decoded.userId);
        if (!currentUser) {
            return next(new ApiError('The user that belong to this token no longer exist', 401));
        }

        next();
    })
}
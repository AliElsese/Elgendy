const jwt = require('jsonwebtoken');
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
        if(!user || req.body.password != user.password) {
            next(new ApiError('المستخدم او كلمة السر خطأ' , 401));
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
            return next(new ApiError('من فضلك قم بتسجيل الدخول اولا', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const currentUser = await UserModel.findById(decoded.userId);
        if (!currentUser) {
            return next(new ApiError('The user that belong to this token no longer exist', 401));
        }

        next();
    }),

    checkActivationCode : asyncHandler(async (req , res , next) => {
        macaddress.one(async (err,mac) => {
            const user = await UserModel.findById({ _id: req.body.userId })
            if(!user || user.activationCode != req.body.activationCode) {
                next(new ApiError('كود التفعيل خطأ' , 401));
            }
            else {
                const userData = await UserModel.findByIdAndUpdate(
                    { _id: user._id } , { macAddress: mac } , { new: true }
                )
                const token = generateToken(user._id);
                res.status(200).json({ data: userData , token });
            }
        })
    })
}
const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const UserModel = require('../../models/user-model');

exports.createUserValidator = [
    check('username').notEmpty().withMessage('اسم المستخدم مطلوب')
    .custom(async (val) => {
        await UserModel.findOne({ username: val }).then((user) => {
            if(user) {
                return new ApiError('هذا المستخدم موجود بالفعل' , 500);
            }
        })
    }),

    check('password').notEmpty().withMessage('كلمة السر مطلوبة')
    .isLength({ min: 6 }).withMessage('يجب ان لا تقل كلمة السر عن 6 احرف'),

    validatorMiddleware
]

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User Id Format'),
    
    validatorMiddleware
]

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User Id Format'),
    
    validatorMiddleware
]

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User Id Format'),

    validatorMiddleware
]
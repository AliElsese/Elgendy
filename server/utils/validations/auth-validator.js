const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator-middleware');

exports.userLoginValidator = [
    check('username').notEmpty().withMessage('اسم المستخدم مطلوب'),
    
    check('password').notEmpty().withMessage('كلمة السر مطلوبة'),

    validatorMiddleware
]
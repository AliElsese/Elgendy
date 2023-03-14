const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator-middleware');

exports.userLoginValidator = [
    check('username').notEmpty().withMessage('Username Is Required'),
    
    check('password').notEmpty().withMessage('Password Is Required'),

    validatorMiddleware
]
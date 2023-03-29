const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const CompanyModel = require('../../models/company-model');

exports.createCompanyValidator = [
    check('companyName').notEmpty().withMessage('اسم الشركة مطلوب')
    .custom(async (val) => {
        await CompanyModel.findOne({ companyName: val }).then((company) => {
            if(company) {
                return new ApiError('هذه الشركة موجوده بالفعل' , 500);
            }
        })
    }),

    check('companyAddress').notEmpty().withMessage('عنوان الشركة مطلوب'),

    check('companyScope').notEmpty().withMessage('تخصص الشركة مطلوبة'),

    check('companyTaxNumber').notEmpty().withMessage('الرقم الضريبي للشركة مطلوب'),

    validatorMiddleware
]

exports.getCompanyValidator = [
    check('id').isMongoId().withMessage('Invalid User Id Format'),
    
    validatorMiddleware
]

exports.updateCompanyValidator = [
    check('id').isMongoId().withMessage('Invalid User Id Format'),

    check('companyName').notEmpty().withMessage('اسم الشركة مطلوب')
    .custom(async (val) => {
        await CompanyModel.findOne({ companyName: val }).then((company) => {
            if(company) {
                return new ApiError('هذه الشركة موجوده بالفعل' , 500);
            }
        })
    }),

    check('companyAddress').notEmpty().withMessage('عنوان الشركة مطلوب'),

    check('companyScope').notEmpty().withMessage('تخصص الشركة مطلوبة'),

    check('companyTaxNumber').notEmpty().withMessage('الرقم الضريبي للشركة مطلوب'),
    
    validatorMiddleware
]

exports.deleteCompanyValidator = [
    check('id').isMongoId().withMessage('Invalid User Id Format'),

    validatorMiddleware
]
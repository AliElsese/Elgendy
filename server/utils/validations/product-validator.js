const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const ProductModel = require('../../models/product-model')

exports.addProductValidator = [
    check('proCode').notEmpty().withMessage('كود الصنف مطلوب')
    .custom(async (val) => {
        await ProductModel.findOne({ proCode: val }).then((product) => {
            if(product) {                
                return Promise.reject('كود الصنف موجود بالفعل');
            }
        })
    }),

    check('proName').notEmpty().withMessage('اسم الصنف مطلوب'),

    validatorMiddleware
]

exports.getProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]

exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),

    check('proName').notEmpty().withMessage('اسم الصنف مطلوب'),

    validatorMiddleware
]

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]
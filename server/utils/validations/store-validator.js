const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const ProductModel = require('../../models/product-model')

exports.addStoreProductValidator = [
    check('proCode').notEmpty().withMessage('كود الصنف مطلوب')
    .custom(async (val) => {
        await ProductModel.findOne({ proCode: val }).then((product) => {
            if(!product) {                
                return Promise.reject('كود الصنف غير موجود قم بادخاله اولا');
            }
        })
    }),

    check('proQuantity').notEmpty().withMessage('كمية الصنف مطلوبة'),

    validatorMiddleware
]

exports.getStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]

exports.updateStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),

    check('proQuantity').notEmpty().withMessage('كمية الصنف مطلوبة'),

    check('proPrice').notEmpty().withMessage('سعر الصنف مطلوب'),

    validatorMiddleware
]

exports.deleteStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]
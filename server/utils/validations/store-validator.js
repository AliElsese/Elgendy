const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const StoreModel = require('../../models/store-model')

exports.addStoreProductValidator = [
    check('proCode').notEmpty().withMessage('كود الصنف مطلوب')
    .custom(async (val) => {
        await StoreModel.findOne({ proCode: val }).then((product) => {
            if(product) {                
                return Promise.reject('كود الصنف موجود بالفعل');
            }
        })
    }),

    check('proQuantity').notEmpty().withMessage('كمية الصنف مطلوبة'),

    check('proCost').notEmpty().withMessage('سعر الصنف مطلوب'),

    validatorMiddleware
]

exports.getStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]

exports.updateStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),

    check('proQuantity').notEmpty().withMessage('كمية الصنف مطلوبة'),

    check('proCost').notEmpty().withMessage('سعر الصنف مطلوب'),

    validatorMiddleware
]

exports.deleteStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]
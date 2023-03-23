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

    check('proSale').notEmpty().withMessage('خصم الصنف مطلوب'),

    check('proExtraSale').notEmpty().withMessage('الخصم الاضافي مطلوب'),

    check('proTaxRate').notEmpty().withMessage('نسبة الضريبة مطلوبة'),

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

    check('proSale').notEmpty().withMessage('خصم الصنف مطلوب'),

    check('proExtraSale').notEmpty().withMessage('الخصم الاضافي مطلوب'),

    check('proTaxRate').notEmpty().withMessage('نسبة الضريبة مطلوبه'),

    check('proTaxValue').notEmpty().withMessage('قيمة الضريبة مطلوبة'),

    check('proTotalVat').notEmpty().withMessage('اجمالي السعر شامل القيمة المضافة مطلوبة'),

    validatorMiddleware
]

exports.deleteStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]
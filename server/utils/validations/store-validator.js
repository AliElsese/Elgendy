const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const StoreModel = require('../../models/store-model')

exports.addStoreProductValidator = [
    check('proCode').notEmpty().withMessage('Product Code Required')
    .custom(async (val) => {
        await StoreModel.findOne({ proCode: val }).then((product) => {
            if(product) {                
                return Promise.reject('Product Code Already Exists');
            }
        })
    }),

    check('proQuantity').notEmpty().withMessage('Product Quantity Required'),

    check('proCost').notEmpty().withMessage('Product Cost Required'),

    check('proSale').notEmpty().withMessage('Product Sale Required'),

    check('proExtraSale').notEmpty().withMessage('Product ExtraSale Required'),

    check('proTaxRate').notEmpty().withMessage('Product TaxRate Required'),

    validatorMiddleware
]

exports.getStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]

// exports.updateStoreProductValidator = [
//     check('id').isMongoId().withMessage('Invalid Product Id Format'),

//     check('proName').notEmpty().withMessage('Product Name Required'),

//     validatorMiddleware
// ]

exports.deleteStoreProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product Id Format'),
    validatorMiddleware
]
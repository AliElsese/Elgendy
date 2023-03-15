const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const BuyInvoiceModel = require('../../models/buy-model')

exports.addInvoiceValidator = [
    check('invoiceNumber').notEmpty().withMessage('Invoice Code Required')
    .custom(async (val) => {
        await BuyInvoiceModel.findOne({ invoiceNumber: val }).then((invoice) => {
            if(invoice) {                
                return Promise.reject('Invoice Code Already Exists');
            }
        })
    }),

    check('products').notEmpty().withMessage('Products Required'),

    validatorMiddleware
]

exports.getInvoiceValidator = [
    check('id').isMongoId().withMessage('Invalid Invoice Id Format'),
    validatorMiddleware
]

exports.updateInvoiceValidator = [
    check('id').isMongoId().withMessage('Invalid Invoice Id Format'),

    check('invoiceNumber').notEmpty().withMessage('Invoice Code Required'),

    check('products').notEmpty().withMessage('Products Required'),

    validatorMiddleware
]

exports.deleteInvoiceValidator = [
    check('id').isMongoId().withMessage('Invalid Invoice Id Format'),
    validatorMiddleware
]
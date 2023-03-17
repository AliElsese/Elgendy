const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const SaleInvoiceModel = require('../../models/sale-model');
const ProductModel = require('../../models/product-model');

exports.addInvoiceValidator = [
    check('invoiceNumber').notEmpty().withMessage('Invoice Code Required')
    .custom(async (val) => {
        await SaleInvoiceModel.findOne({ invoiceNumber: val }).then((invoice) => {
            if(invoice) {                
                return Promise.reject('Invoice Code Already Exists');
            }
        })
    }),

    check('products').notEmpty().withMessage('Products Required')
    .custom(async (products) => {
        for(var i = 0; i < products.length; i++) {
            if(!products[i].proCode || !products[i].proQuantity || !products[i].proCost || !products[i].proSale || !products[i].proTaxRate) {
                throw new Error('All Inputs Are Required');
            }
            await ProductModel.findOne({ proCode: products[i].proCode }).then((product) => {
                if(!product) {
                    return Promise.reject(`Product Not Found With This Code:${products[i].proCode} Insert It First..`);
                }
            })
        }
    }),

    validatorMiddleware
]

exports.getInvoiceValidator = [
    check('id').isMongoId().withMessage('Invalid Invoice Id Format'),
    validatorMiddleware
]

exports.updateInvoiceValidator = [
    check('id').isMongoId().withMessage('Invalid Invoice Id Format'),

    check('invoiceNumber').notEmpty().withMessage('Invoice Code Required'),

    check('products').notEmpty().withMessage('Products Required')
    .custom(async (products) => {
        for(var i = 0; i < products.length; i++) {
            if(!products[i].proQuantity || !products[i].proCost || !products[i].proSale || !products[i].proTaxRate || !products[i].proTaxValue  || !products[i].proTotalVat) {
                throw new Error('All Inputs Are Required');
            }
            await ProductModel.findOne({ proCode: products[i].proCode }).then((product) => {
                if(!product) {
                    return Promise.reject(`Product Not Found With This Code:${products[i].proCode} Insert It First..`);
                }
            })
        }
    }),

    validatorMiddleware
]

exports.deleteInvoiceValidator = [
    check('id').isMongoId().withMessage('Invalid Invoice Id Format'),
    validatorMiddleware
]
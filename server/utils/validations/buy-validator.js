const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const BuyInvoiceModel = require('../../models/buy-model');
const ProductModel = require('../../models/product-model');

exports.saveBuyInvoice = [
    check('invoiceNumber').notEmpty().withMessage('رقم الفاتورة مطلوب')
    .custom(async (val) => {
        await BuyInvoiceModel.findOne({ invoiceNumber: val }).then((invoice) => {
            if(invoice) {                
                return Promise.reject('رقم الفاتورة موجود بالفعل');
            }
        })
    }),

    validatorMiddleware
]

exports.addInvoiceValidator = [
    check('invoiceNumber').notEmpty().withMessage('رقم الفاتورة مطلوب')
    .custom(async (val) => {
        await BuyInvoiceModel.findOne({ invoiceNumber: val }).then((invoice) => {
            if(invoice) {                
                return Promise.reject('رقم الفاتورة موجود بالفعل');
            }
        })
    }),

    check('products').notEmpty().withMessage('الاصناف مطلوبة')
    .custom(async (products) => {
        for(var i = 0; i < products.length; i++) {
            if(!products[i].proCode || !products[i].proQuantity || !products[i].proCost || !products[i].proSale || !products[i].proTaxRate) {
                throw new Error('جميع المدخلات مطلوبة');
            }
            await ProductModel.findOne({ proCode: products[i].proCode }).then((product) => {
                if(!product) {
                    return Promise.reject(`لا يوجد صنف بهذا الكود: ${products[i].proCode} قم بادخاله اولا`);
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

    check('invoiceNumber').notEmpty().withMessage('رقم الفاتورة مطلوب'),

    check('products').notEmpty().withMessage('الاصناف مطلوبة')
    .custom(async (products) => {
        for(var i = 0; i < products.length; i++) {
            if(!products[i].proQuantity || !products[i].proCost || !products[i].proSale || !products[i].proTaxRate || !products[i].proTaxValue  || !products[i].proTotalVat) {
                throw new Error('جميع المخلات مطلوبة');
            }
            await ProductModel.findOne({ proCode: products[i].proCode }).then((product) => {
                if(!product) {
                    return Promise.reject(`لا يوجد صنف بهذا الكود: ${products[i].proCode} قم بادخاله اولا`);
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
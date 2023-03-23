const { check } = require('express-validator');
const ApiError = require('../apiError');
const validatorMiddleware = require('../../middlewares/validator-middleware');

const SaleInvoiceModel = require('../../models/sale-model');
const ProductModel = require('../../models/product-model');
const StoreModel = require('../../models/store-model');

exports.addInvoiceValidator = [
    check('invoiceNumber').notEmpty().withMessage('رقم الفاتورة مطلوب')
    .custom(async (val) => {
        await SaleInvoiceModel.findOne({ invoiceNumber: val }).then((invoice) => {
            if(invoice) {                
                return Promise.reject('رقم الفاتورة مستخدم من قبل');
            }
        })
    }),

    check('products').notEmpty().withMessage('الاصناف مطلوبة')
    .custom(async (products) => {
        for(var i = 0; i < products.length; i++) {
            if(!products[i].proCode || !products[i].proQuantity || !products[i].proCost || !products[i].proSale || !products[i].proTaxRate) {
                throw new Error('كل المدخلات مطلوبة');
            }
            await StoreModel.findOne({ proCode: products[i].proCode }).then((product) => {
                if(!product) {
                    return Promise.reject(`لا يوجد صنف بهذا الكود: ${products[i].proCode} قم بادخاله اولا`);
                }
                else {
                    if(product.proQuantity < products[i].proQuantity) {
                        return Promise.reject(`الكمية المطلوبه اكبر من الموجوده بالمخزن`);
                    }
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
                throw new Error('مطلوب جميع المدخلات');
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
const express = require('express')

const { checkToken } = require('../controllers/auth-controller');

const {
    addProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator,
    getProductCodeValidator
} = require('../utils/validations/product-validator');

const {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getReport,
    getProductByCode
} = require('../controllers/product-controller');

const router = express.Router();

router.post('/addProduct' , checkToken , addProductValidator , addProduct)
router.get('/getProducts' , checkToken , getProducts)
router.get('/getProduct/:id' , checkToken , getProductValidator , getProduct)
router.post('/getProductCode' , checkToken , getProductCodeValidator , getProductByCode)
router.put('/updateProduct/:id' , checkToken , updateProductValidator , updateProduct)
router.delete('/deleteProduct/:id' , checkToken , deleteProductValidator , deleteProduct)
router.post('/getProductsReport' , checkToken , getReport)

module.exports = router;
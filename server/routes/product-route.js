const express = require('express')

const {
    addProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator
} = require('../utils/validations/product-validator');

const {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product-controller');

const router = express.Router()

router.post('/addProduct' , addProductValidator , addProduct)
router.get('/getProducts' , getProducts)
router.get('/getProduct/:id' , getProductValidator , getProduct)
router.put('/updateProduct/:id' , updateProductValidator , updateProduct)
router.delete('/deleteProduct/:id' , deleteProductValidator , deleteProduct)

module.exports = router
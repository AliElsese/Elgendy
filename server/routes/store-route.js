const express = require('express')

const { checkToken } = require('../controllers/auth-controller');

const {
    addStoreProductValidator,
    getStoreProductValidator,
    // updateProductValidator,
    deleteStoreProductValidator
} = require('../utils/validations/store-validator');

const {
    addStoreProduct,
    getStoreProducts,
    getStoreProduct,
    // updateStoreProduct,
    deleteStoreProduct
} = require('../controllers/store-controller');

const router = express.Router();

router.post('/addStoreProduct' , checkToken , addStoreProductValidator , addStoreProduct)
router.get('/getStoreProducts' , checkToken , getStoreProducts)
router.get('/getStoreProduct/:id' , checkToken , getStoreProductValidator , getStoreProduct)
// router.put('/updateStoreProduct/:id' , checkToken , updateProductValidator , updateStoreProduct)
router.delete('/deleteStoreProduct/:id' , checkToken , deleteStoreProductValidator , deleteStoreProduct)

module.exports = router;
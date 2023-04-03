const express = require('express');

const { checkToken } = require('../controllers/auth-controller');

const {
    addInvoiceValidator,
    getInvoiceValidator,
    updateInvoiceValidator,
    deleteInvoiceValidator
} = require('../utils/validations/sale-validator');

const {
    addInvoice,
    getInvoices,
    getInvoice,
    updateInvoice,
    deleteInvoice,
    getReport,
    getSingleReport
} = require('../controllers/sale-controller');

const router = express.Router();

router.post('/addInvoice' , checkToken , addInvoiceValidator , addInvoice);
router.get('/getInvoices' , checkToken , getInvoices);
router.get('/getInvoice/:id' , checkToken , getInvoiceValidator , getInvoice);
router.put('/updateProduct/:id' , checkToken , updateInvoiceValidator , updateInvoice);
router.delete('/deleteInvoice/:id' , checkToken , deleteInvoiceValidator , deleteInvoice);
router.post('/getInvoicesReport' , checkToken , getReport);
router.post('/generateSingleInvoice' , checkToken , getSingleReport);

module.exports = router;
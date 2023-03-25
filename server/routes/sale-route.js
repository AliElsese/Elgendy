const express = require('express');
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , './server/uploads')
    },

    filename : (req , file , cb) => {
        cb(null , file.originalname)
    }
})
const upload = multer({ storage : storage });

const { checkToken } = require('../controllers/auth-controller');

const {
    addInvoiceValidator,
    getInvoiceValidator,
    updateInvoiceValidator,
    deleteInvoiceValidator
} = require('../utils/validations/sale-validator');

const {
    createSaleInvoice,
    addInvoice,
    getInvoices,
    getInvoice,
    updateInvoice,
    deleteInvoice,
    getReport,
    getSingleReport
} = require('../controllers/sale-controller');

const router = express.Router();

router.post('/saveInvoice' , upload.single('invoiceFile') , createSaleInvoice);
router.post('/addInvoice' , checkToken , addInvoiceValidator , addInvoice);
router.get('/getInvoices' , checkToken , getInvoices);
router.get('/getInvoice/:id' , checkToken , getInvoiceValidator , getInvoice);
router.put('/updateProduct/:id' , checkToken , updateInvoiceValidator , updateInvoice);
router.delete('/deleteInvoice/:id' , checkToken , deleteInvoiceValidator , deleteInvoice);
router.post('/getInvoicesReport' , checkToken , getReport);
router.post('/getSingleInvoiceReport' , checkToken , getSingleReport);

module.exports = router;
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
    createBuyInvoice
} = require('../controllers/buy-controller');

const router = express.Router();

router.post('/saveBuyInvoice' , upload.single('invoiceFile') , createBuyInvoice);

module.exports = router;
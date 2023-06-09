const express = require('express')

const { checkToken } = require('../controllers/auth-controller');

// User Validators
const {
    getCompanyValidator,
    createCompanyValidator,
    updateCompanyValidator,
    deleteCompanyValidator
} = require('../utils/validations/company-validator');

// User Services
const {
    getCompany,
    getAllCompanies,
    createCompany,
    updateCompany,
    deleteCompany
} = require('../controllers/company-controller');

const router = express.Router();

router.get('/companies' , checkToken , getAllCompanies);
router.get('/getCompany/:id' , checkToken , getCompanyValidator , getCompany);
router.post('/createCompany' , checkToken , createCompanyValidator , createCompany);
router.put('/updateCompany/:id' , checkToken , updateCompanyValidator , updateCompany);
router.delete('/deleteCompany/:id' , checkToken , deleteCompanyValidator , deleteCompany);

module.exports = router;
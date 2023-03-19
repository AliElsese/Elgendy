const express = require('express');

const {
    userLoginValidator
} = require('../utils/validations/auth-validator')

const {
    userLogin,
    checkActivationCode
} = require('../controllers/auth-controller');

const router = express.Router();

router.post('/userlogin' , userLoginValidator , userLogin);
router.post('/activationCode' , checkActivationCode)

module.exports = router;
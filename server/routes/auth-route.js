const express = require('express');

const {
    userLoginValidator
} = require('../utils/validations/auth-validator')

const {
    userLogin
} = require('../controllers/auth-controller');

const router = express.Router();

router.post('/userlogin' , userLoginValidator , userLogin);

module.exports = router;
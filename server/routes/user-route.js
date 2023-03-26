const express = require('express');

const { checkToken } = require('../controllers/user-controller')

// User Validators
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator
} = require('../utils/validators/admin-validator');

// User Services
const {
    getUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
} = require('../controllers/admin-controller');

const router = express.Router();

router.get('/users' , checkToken , getAllUsers);
router.get('/getUser/:id' , checkToken , getUserValidator , getUser);
router.post('/createUser' , checkToken , createUserValidator , createUser);
router.put('/updateUser/:id' , checkToken , updateUserValidator , updateUser);
router.delete('/deleteUser/:id' , checkToken , deleteUserValidator , deleteUser);

module.exports = router;
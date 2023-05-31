const express = require('express')
const router = express.Router();
const AuthController = require('../controllers/auth');
const asyncHandler = require('../handlers/asyncHandler');

router.post('/register', asyncHandler(AuthController.RegisterUser));
router.get('/login', asyncHandler(AuthController.LoginUser));

module.exports = router

export {};
const express = require('express');
const { loginController } = require('../userController');

const router = express.Router();

router.post('/', loginController);

module.exports = { router };
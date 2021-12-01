const express = require('express');
const { createUserController } = require('../userController');

const router = express.Router();

router.post('/', createUserController);

module.exports = { router };
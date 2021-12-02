const express = require('express');
const { createUserController, createAdminControler } = require('../userController');
const { validateToken } = require('../../middlware/validateToken');

const router = express.Router();

router.post('/', createUserController);
router.post('/admin', validateToken, createAdminControler);

module.exports = { router };
const express = require('express');
const {
    createRecipeController,
    listRecipesController,
} = require('../recipeController');

const { validateToken } = require('../../middlware/validateToken');

const router = express.Router();

router.get('/', listRecipesController);

router.post('/', validateToken, createRecipeController);

module.exports = { router };
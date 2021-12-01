const express = require('express');
const {
    createRecipeController,
    listRecipesController,
    findRecipeByIdController,
} = require('../recipeController');

const { validateToken } = require('../../middlware/validateToken');

const router = express.Router();

router.get('/', listRecipesController);
router.get('/:id', findRecipeByIdController);

router.post('/', validateToken, createRecipeController);

module.exports = { router };
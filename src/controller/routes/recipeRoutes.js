const express = require('express');
const {
    createRecipeController,
    listRecipesController,
    findRecipeByIdController,
    updateRecipeController,
} = require('../recipeController');

const { validateToken } = require('../../middlware/validateToken');

const router = express.Router();

router.get('/', listRecipesController);
router.get('/:id', findRecipeByIdController);

router.post('/', validateToken, createRecipeController);

router.put('/:id', validateToken, updateRecipeController);

module.exports = { router };
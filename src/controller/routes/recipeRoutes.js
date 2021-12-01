const express = require('express');
const {
    createRecipeController,
    listRecipesController,
    findRecipeByIdController,
    updateRecipeController,
    deleteRecipeController,
    addImgController,
} = require('../recipeController');

const { validateToken } = require('../../middlware/validateToken');

const router = express.Router();

router.get('/', listRecipesController);
router.get('/:id', findRecipeByIdController);

router.post('/', validateToken, createRecipeController);

router.put('/:id/image', validateToken, addImgController);
router.put('/:id', validateToken, updateRecipeController);

router.delete('/:id', validateToken, deleteRecipeController);

module.exports = { router };
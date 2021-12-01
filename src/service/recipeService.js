const { newError } = require('../utils/newError');
const {
    createRecipeModel,
    listRecipes,
} = require('../model/recipesModel');
const { recipeSchema } = require('./joiSchemas');
const dictErr = require('../dictionaryError');

const createRecipeService = async (name, ingredients, preparation, userId) => {
    const { error } = recipeSchema.validate({ name, ingredients, preparation });
    if (error) return newError(dictErr.invalidEntries());

    const recipeCreated = await createRecipeModel(name, ingredients, preparation, userId);
    return recipeCreated;
};

const listRecipesService = async () => {
    const recipes = await listRecipes();
    return recipes;
};

module.exports = {
    createRecipeService,
    listRecipesService,
};

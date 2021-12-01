const { newError } = require('../utils/newError');
const {
    createRecipeModel,
    listRecipes,
    findRecipeById,
    updateRecipe,
    deleteRecipe,
    addURLImg,
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

const findRecipeByIdService = async (recipeId) => {
    const recipe = await findRecipeById(recipeId);
    if (!recipe) return newError(dictErr.recipeNotFound());
    return recipe;
};

const canChangeRecipe = (role, userId, recipe) => {
    if (role === 'admin') return true;
    if (JSON.stringify(recipe.userId) === JSON.stringify(userId)) return true;
    return false;
};

const updateRecipeService = async (recipeData, userId, role) => {
    const { ingredients, name, preparation, recipeId } = recipeData;
    const oldRecipe = await findRecipeById(recipeId);

    if (!canChangeRecipe(role, userId, oldRecipe)) return newError(dictErr.missingAuthToken());

    await updateRecipe(name, ingredients, preparation, recipeId);
    const recipeUpdated = await findRecipeById(recipeId);
    return recipeUpdated;
};

const deleteRecipeService = async (role, userId, recipeId) => {
    const oldRecipe = await findRecipeById(recipeId);

    if (!canChangeRecipe(role, userId, oldRecipe)) return newError(dictErr.missingAuthToken());

    await deleteRecipe(recipeId);
    return oldRecipe;
};

const addURLImgService = async (recipeId, path, role, userId) => {
    const oldRecipe = await findRecipeById(recipeId);

    if (!canChangeRecipe(role, userId, oldRecipe)) return newError(dictErr.missingAuthToken());

    const urlImg = `localhost:3000/${path}`;
    await addURLImg(recipeId, urlImg);
    
    const recipeUpdated = await findRecipeById(recipeId);
    return recipeUpdated;
};

module.exports = {
    createRecipeService,
    listRecipesService,
    findRecipeByIdService,
    updateRecipeService,
    deleteRecipeService,
    addURLImgService,
};

const {
  createRecipeService,
  listRecipesService,
  findRecipeByIdService,
  updateRecipeService,
} = require('../service/recipeService');
const { CREATED, OK } = require('../utils/statusHttp');

const createRecipeController = async (req, res, next) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const { _id } = req.user;
    const userId = _id;
    const recipeCreated = await createRecipeService(
      name,
      ingredients,
      preparation,
      userId,
    );
    return res.status(CREATED).json(recipeCreated);
  } catch (error) {
    return next(error);
  }
};

const listRecipesController = async (req, res, next) => {
  try {
    const recipes = await listRecipesService();
    return res.status(OK).json(recipes);
  } catch (error) {
    return next(error);
  }
};

const findRecipeByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await findRecipeByIdService(id);
    return res.status(OK).json(recipe);
  } catch (error) {
    return next(error);
  }
};

const updateRecipeController = async (req, res, next) => {
  try {
    const recipeId = req.params.id;
    const { _id, role } = req.user;
    const userId = _id;
    const { ingredients, name, preparation } = req.body;
    const updatedRecipe = await updateRecipeService({
        ingredients,
        name,
        preparation,
        recipeId,
        }, userId, role);
    return res.status(OK).json(updatedRecipe);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRecipeController,
  listRecipesController,
  findRecipeByIdController,
  updateRecipeController,
};

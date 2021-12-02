const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createRecipeModel = async (name, ingredients, preparation, userId) => {
  const newRecipe = await connection()
    .then((db) => db.collection('recipes').insertOne({ name, ingredients, preparation, userId }));

    const recipeCreated = { recipe: {
        name,
        ingredients,
        preparation,
        userId,
        _id: newRecipe.insertedId,
    } };
    return recipeCreated;
};

const listRecipes = async () => {
  const recipes = await connection()
    .then((db) => db.collection('recipes').find().toArray());
  return recipes;
};

const findRecipeById = async (recipeId) => {
  if (!ObjectId.isValid(recipeId)) return null;

  const recipe = await connection()
    .then((db) => db.collection('recipes').findOne({ _id: ObjectId(recipeId) }));
  return recipe;
};

const updateRecipe = async (name, ingredients, preparation, recipeId) => {
  if (!ObjectId.isValid(recipeId)) return null;

  const recipeUpdated = await connection()
    .then((db) => db.collection('recipes').updateOne(
      { _id: ObjectId(recipeId) },
      { $set: { name, ingredients, preparation } },
    ));
  return recipeUpdated;
};

const deleteRecipe = async (recipeId) => {
  if (!ObjectId.isValid(recipeId)) return null;

  const recipeDeleted = await connection()
    .then((db) => db.collection('recipes').deleteOne({
      _id: ObjectId(recipeId),
    }));

  return recipeDeleted;
};

const addURLImg = async (recipeId, urlImg) => {
  if (!ObjectId.isValid(recipeId)) return null;

  const recipe = await connection()
    .then((db) => db.collection('recipes').updateOne(
      { _id: ObjectId(recipeId) },
      { $set: { image: urlImg } },
    ));

  return recipe;
};

module.exports = {
  createRecipeModel,
  listRecipes,
  findRecipeById,
  updateRecipe,
  deleteRecipe,
  addURLImg,
};

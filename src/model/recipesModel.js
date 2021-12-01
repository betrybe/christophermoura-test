const connection = require('./connection');

const createRecipeModel = async (name, ingredients, preparation, userId) => {
  const newRecipe = await connection().then((db) =>
    db
      .collection('recipes')
      .insertOne({ name, ingredients, preparation, userId }));

  const recipeCreated = {
    recipe: {
      name,
      ingredients,
      preparation,
      userId,
      _id: newRecipe.insertedId,
    },
  };
  return recipeCreated;
};

const listRecipes = async () => {
  const recipes = await connection().then((db) =>
    db.collection('recipes').find().toArray());
  return recipes;
};

module.exports = {
  createRecipeModel,
  listRecipes,
};

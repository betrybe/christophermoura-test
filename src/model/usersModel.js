const connection = require('./connection');

const createUser = async ({ name, email, password, role }) => {
  const newUser = await connection()
    .then((db) => db.collection('users').insertOne({ name, email, password, role }));
  const response = { user: { name, email, role, _id: newUser.insertedId } };

  return response;
};

const findByEmail = async (email) => {
  const user = await connection()
    .then((db) => db.collection('users').findOne({ email }));
  return user;
};

module.exports = {
  createUser,
  findByEmail,
};

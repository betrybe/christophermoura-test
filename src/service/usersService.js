const { createUser, findByEmail } = require('../model/usersModel');
const { newError } = require('../utils/newError');
const { newUserSchema } = require('./joiSchemas');
const dictErr = require('../dictionaryError');

const createUserService = async (name, email, password, role = 'user') => {
  const existsEmail = await findByEmail(email);
  if (existsEmail) return newError(dictErr.emailAlreadyExists());

  const { value, error } = newUserSchema.validate({
    name,
    email,
    password,
    role,
  });
  if (error) return newError(dictErr.invalidEntries());

  const userCreated = await createUser(value);

  return userCreated;
};

module.exports = {
  createUserService,
};

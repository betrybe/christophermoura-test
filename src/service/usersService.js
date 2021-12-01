const { createUser, findByEmail } = require('../model/usersModel');
const { createToken } = require('../utils/createToken');
const { newError } = require('../utils/newError');
const { newUserSchema, loginSchema } = require('./joiSchemas');
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

const loginService = async (email, password) => {
  const { error } = loginSchema.validate({ email, password });
  if (error) return newError(dictErr.allFields());

  const user = await findByEmail(email);
  if (!user || user.password !== password) return newError(dictErr.incorrectNameOrPass());

  const { _password, ...userWithoutPassword } = user;

  const token = createToken(userWithoutPassword);
  return token;
};

module.exports = {
  createUserService,
  loginService,
};

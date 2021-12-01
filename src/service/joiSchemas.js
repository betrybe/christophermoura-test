const Joi = require('joi');

const newUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.required(),
  role: Joi.string().default('user'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.required(),
});

module.exports = {
  newUserSchema,
  loginSchema,
};

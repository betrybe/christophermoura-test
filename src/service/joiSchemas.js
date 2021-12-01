const Joi = require('joi');

const newUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.required(),
  role: Joi.string().default('user'),
});

module.exports = {
    newUserSchema,
};
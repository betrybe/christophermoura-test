require('dotenv').config();
const jwt = require('jsonwebtoken');
const { findByEmail } = require('../model/usersModel');
const dictError = require('../dictionaryError');

const secret = process.env.JWT_SECRET || 'Trybe#VQV';

const validateToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next(dictError.missingAuthToken());

  try {
    const { email } = jwt.verify(token, secret);

    const user = await findByEmail(email);
    if (!user) return next(dictError.jwtMalformed());

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    return next();
  } catch (error) {
    if (error.message === 'jwt malformed') return next(dictError.jwtMalformed());
    return next(error);
  }
};

module.exports = { validateToken };

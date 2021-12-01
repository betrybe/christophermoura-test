require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtConfig = {
    expiresIn: '15m',
    algorithm: 'HS256',
};

const secret = process.env.JWT_SECRET || 'Trybe#VQV';

const createToken = (payload) => {
    const token = jwt.sign(payload, secret, jwtConfig);
    return token;
};

module.exports = { createToken };
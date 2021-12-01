const { createUserService } = require('../service/usersService');
const { CREATED } = require('../utils/statusHttp');

const createUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userCreated = await createUserService(name, email, password);
    return res.status(CREATED).json(userCreated);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
    createUserController,
};
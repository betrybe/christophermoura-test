const { createUserService, loginService } = require('../service/usersService');
const { CREATED, OK } = require('../utils/statusHttp');

const createUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userCreated = await createUserService(name, email, password);
    return res.status(CREATED).json(userCreated);
  } catch (error) {
    return next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await loginService(email, password);
    res.status(OK).json({ token });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUserController,
  loginController,
};

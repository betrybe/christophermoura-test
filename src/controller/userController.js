const { createUserService, loginService, createAdminService } = require('../service/usersService');
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

const createAdminControler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { role } = req.user;
    const newUser = {
      name,
      email,
      password,
      role: 'admin',
    };
    const adminCreated = await createAdminService(role, newUser);
    return res.status(CREATED).json(adminCreated);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUserController,
  loginController,
  createAdminControler,
};

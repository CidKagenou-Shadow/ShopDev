const {
    loginShopService,
    registerShopService
} = require("../services/auth/access.services.js");

const { OK } = require("../core/response/success.response.js");
const { BadRequestError } = require("../core/response/error.response.js");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequestError({message: "Email and password are required"});

  const result = await loginShopService(email, password);

  return new OK({
      message: "Login successful",
      metadata: {
          tokens: result.tokens,
          shop: result.shop
      }
  }).send(res);
};

const register = async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) throw new BadRequestError({message: "Email, password, and name are required"});

  const result = await registerShopService({ email, password, name });

  return new OK({
      message: "Register successful",
      metadata: {
          tokens: result.tokens,
          shop: result.shop
      }
  }).send(res);
};

const logout = async (req, res, next) => {

};

module.exports = {
    login,
    register,
    logout
};

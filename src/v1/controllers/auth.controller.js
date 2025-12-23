const {
    loginShopService,
    registerShopService,
    logoutShopService,
    handlerRefreshToken
} = require("../services/auth/access.services.js");

const { OK } = require("../core/response/success.response.js");
const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../core/response/error.response.js");
const { asyncHandler } = require("../helpers/asyncHandler.helpers.js");

const login = asyncHandler(async (req, res, next) => {
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
});

const register = asyncHandler(async (req, res, next) => {
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
});

const logout = asyncHandler(async (req, res, next) => {
    console.log("req : " + JSON.stringify(req.user));
    const shopId = req.user.shopId;

    if (!shopId) throw new NotFoundError({message: "Shop ID is required"});

    return new OK({
            message : await logoutShopService(shopId)
        }).send(res);

});

const handleRefreshToken = asyncHandler(async (req,res,next) => {
    console.log("header : " + JSON.stringify(req.headers));
    const userId = req.headers['x-client-id'];
    if (!userId) throw new UnauthenticatedError({
        message : "missing user/shop id"
    })
    const refreshToken = req.headers['authorization']

    if (!refreshToken) throw new UnauthenticatedError({
        message : "missing refresh token"
    });
    
    return new OK({
        message : "success",
        metadata : {
            tokens : await handlerRefreshToken(userId,refreshToken)
        }
    }).send(res);
})
module.exports = {
    login,
    register,
    logout,
    handleRefreshToken
};

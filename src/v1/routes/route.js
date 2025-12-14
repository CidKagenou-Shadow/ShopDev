const express = require("express");
const router = express.Router();
const tokenAuthMiddleware = require("../middlewares/auth/tokens.auth.middleware.js");

router.use("/v1/auth", require("./auth/access.auth.routes"));


//authentication
router.use(tokenAuthMiddleware);


//shop
router.use("/v1/shops",require("./shop/shop.route.js"));


module.exports = router;

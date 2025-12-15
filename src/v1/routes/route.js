const express = require("express");
const router = express.Router();
const { authentications } = require("../auth/auth.auth.js");
const { checkApiKey, checkPermission } = require("../middlewares/auth/apiKey.auth.middleware.js");

router.use(checkApiKey,checkPermission("0000"));


router.use("/v1/auth", require("./auth/access.auth.routes"));


//authentication
router.use(authentications);


//shop
router.use("/v1/shops",require("./shop/shop.route.js"));


module.exports = router;

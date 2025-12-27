const express = require("express");
const router = express.Router();
const { checkApiKey, checkPermission } = require("../middlewares/auth/apiKey.auth.middleware.js");

router.use(checkApiKey,checkPermission("0000"));


router.use("/v1/auth", require("./auth/access.auth.routes"));



//product
router.use("/v1/products",require("./product/index.js"))

//shop
router.use("/v1/shops",require("./shop/shop.route.js"));

//discount
router.use('/v1/discount',require("./discount/index.js"))



module.exports = router;

const express = require("express");
const { login,register,logout, handleRefreshToken } = require("../../controllers/auth.controller");
const { authentications } = require("../../auth/auth.auth");
const router = express.Router();



router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token",handleRefreshToken)
//authenticate token middleware
router.use(authentications);

router.post("/logout", logout);



module.exports = router;

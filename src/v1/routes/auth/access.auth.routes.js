const express = require("express");
const { login } = require("../../controllers/auth.controllers");
const { register } = require("../../controllers/auth.controllers");
const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/logout",logout);



module.exports = router;

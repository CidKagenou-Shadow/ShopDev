const express = require('express');
const router = express.Router();
const {asyncHandler} = require("../../helpers/asyncHandler.helpers");


router.get('/shop-info', asyncHandler( async (req, res) => {
    // Logic to get shop info
    res.json({ message: "Shop info retrieved successfully" });
}));

module.exports = router;
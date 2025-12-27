const express = require("express")
const { authentications } = require("../../auth/auth.auth");
const { createDiscount, getAllDiscountCodeByShop, getAllProductByDiscountCode, getAmountDiscount, deleteDiscountCode } = require("../../controllers/discount.controller");

const router = express.Router()

router.get('/get-products-by-discount-code/:code',getAllProductByDiscountCode);
router.post('/get-amount-discount',getAmountDiscount);

router.use(authentications);

router.post('/create-discount',createDiscount);

router.get('/get-discounts',getAllDiscountCodeByShop)

router.delete('/delete-discount/:code',deleteDiscountCode)


module.exports = router;
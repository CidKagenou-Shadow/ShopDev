const express = require("express")
const { createProduct, getAllProduct, getAllProductDraft, getAllProductPublished, getProduct, setDraftProduct, setPublishedProduct, removeProduct, updateProduct } = require("../../controllers/product.controller");
const { authentications } = require("../../auth/auth.auth");

const router = express.Router()

router.get("/get-product/:productId",getProduct);

router.use(authentications);

router.post("/create-product",createProduct);

router.get('/get-all-products',getAllProduct);

router.get('/get-all-products/draft',getAllProductDraft);

router.get('/get-all-products/published',getAllProductPublished);


router.post('/set-draft',setDraftProduct);

router.post('/set-published',setPublishedProduct);

router.post('/delete-product',removeProduct);

router.patch('/update-product',updateProduct)
module.exports = router;
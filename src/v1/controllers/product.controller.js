const { BadRequestError } = require("../core/response/error.response");
const { OK } = require("../core/response/success.response");
const { asyncHandler } = require("../helpers/asyncHandler.helpers");
const { ProductServices } = require("../services/product/product.service");


const createProduct = asyncHandler(async (req,res,next) => {
    const shopId = req.user.shopId;
    const payload = req.body;


    return new OK({
        message : "success",
        metadata : await ProductServices.createProduct({
                ...payload,
                product_shop : shopId
            })
    }).send(res);
})

const removeProduct = asyncHandler(async (req,res,next) => {
    const shopId = req.user.shopId;
    const {type,productId} = req.body;

    if (!productId) throw new BadRequestError({
        message : "Missing product ID !"
    })

    return new OK({
        message : "success",
        metadata : await ProductServices.removeProduct({
                type,
                product_shop : shopId,
                productId
            })
    }).send(res);
})

const getAllProduct = asyncHandler(async (req,res,next) => {  
    const shopId = req.user.shopId;
    return new OK({
        message : "success",
        metadata : await ProductServices.getAllProduct({shopId})
    }).send(res);
})

const getAllProductDraft = asyncHandler(async (req,res,next) => {  
    const shopId = req.user.shopId;
    return new OK({
        message : "success",
        metadata : await ProductServices.getAllProductDraft({shopId})
    }).send(res);
})

const getAllProductPublished = asyncHandler(async (req,res,next) => {  
    const shopId = req.user.shopId;
    return new OK({
        message : "success",
        metadata : await ProductServices.getAllProductPublished({shopId})
    }).send(res);
})

const getProduct = asyncHandler(async (req,res,next) => {
    const {productId} = req.params;
    if (!productId) throw new BadRequestError({
        message : "Missing product ID !"
    });
    return new OK({
        message : "success",
        metadata : await ProductServices.getProduct({productId})
    }).send(res);
})


const setDraftProduct = asyncHandler(async (req,res,next) => {
    const shopId = req.user.shopId;
    const {productIdList} = req.body;
    if (!Array.isArray(productIdList) || productIdList.length === 0) throw new BadRequestError({
        message: "productIdList must be a non-empty array"
    });
    return new OK({
        message : "success",
        metadata : await ProductServices.setDraft({shopId,productIdList})
    }).send(res);
})


const setPublishedProduct = asyncHandler(async (req,res,next) => {
    const shopId = req.user.shopId;
    const {productIdList} = req.body;
    if (!Array.isArray(productIdList) || productIdList.length === 0) throw new BadRequestError({
        message: "productIdList must be a non-empty array"
    });
    return new OK({
        message : "success",
        metadata : await ProductServices.setPublished({shopId,productIdList})
    }).send(res);
})

const updateProduct = asyncHandler(async (req,res,next) => {
        const shopId = req.user.shopId;
        const payload = req.body;
        if (!payload) throw new BadRequestError({
            message : "Missing update data !!!"
        })

        return new OK({
            message : "success",
            metadata : await ProductServices.updateProduct({shopId,payload})
        }).send(res);


})


module.exports = {
    createProduct,
    getAllProduct,
    getAllProductDraft,
    getAllProductPublished,
    getProduct,
    setDraftProduct,
    setPublishedProduct,
    removeProduct,
    updateProduct
}
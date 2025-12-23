const {productModel} = require("../product/product.model")

const findAllProduct = ({shopId,start = 0, limit = 0}) => {
    return productModel.find({
        product_shop : shopId
    }).sort({
        createdAt : -1
    }).skip(start).limit(limit).lean()
}


const findAllProductDraft = ({shopId}) =>{
    return productModel.find({
        product_shop : shopId,
        isDraft : true
    }).lean()
}

const findAllProductPublished = ({shopId}) => {
    return productModel.find({
        product_shop : shopId,
        isPublished : true
    }).lean()
}


const setDraftProduct = ({shopId,productIdList = []}) => {
    return productModel.updateMany(
        {
            product_shop : shopId,
            _id : { $in : productIdList}
        },
        {
            $set : {
                isPublished : false,
                isDraft : true
            }
        }
    )
}

const setPublishedProduct = ({shopId,productIdList = []}) => {
    return productModel.updateMany(
        {
            product_shop : shopId,
            _id : {$in : productIdList}
        },
        {
            $set : {
                isDraft : false,
                isPublished : true
            }
        }
    )
}

const findProduct = ({productId}) => {
    return productModel.findOne({
        _id : productId
    }).lean()
}

const updateProduct = ({filter,update,options},model) => {
    try{
        return model.findOneAndUpdate(
            filter,
            {$set : update},
            options
        ).lean()
    }catch(error){
        console.log("errror update product ; "+error);
    }
}

module.exports = {
    findAllProductPublished,
    findAllProductDraft,
    setDraftProduct,
    setPublishedProduct,
    findAllProduct,
    findProduct,
    updateProduct
}
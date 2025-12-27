const {DiscountModel} = require("../discount/discount.model")


const getAllDiscountCode = (options,skip,limit) => {

    return DiscountModel.find(options).skip(skip).limit(limit).lean()
}

const getDiscount = (options) => {
    return DiscountModel.findOne(options).lean()
}

module.exports = {
    getAllDiscountCode,
    getDiscount
}
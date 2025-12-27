const { BadRequestError } = require("../core/response/error.response");
const { OK } = require("../core/response/success.response");
const { asyncHandler } = require("../helpers/asyncHandler.helpers");
const { DiscountServices } = require("../services/discount/discount.service");
const { DiscountJoiBuilder } = require("../validations/discount.validations");


const createDiscount = asyncHandler(async (req, res, next) => {
  const payload = req.body;
  const shopId = req.user.shopId;
  
  payload.discount_shop = shopId;

  console.log("Payload : "+JSON.stringify(payload));

  const schemaDiscount = new DiscountJoiBuilder()
    .require([
      "discount_shop",
      "discount_name",
      "discount_code",
      "discount_type",
      "discount_value",
      "max_discount_amount",
      "min_order_value",
      "max_uses",
      "start_date",
      "end_date"
    ])
    .enforceDiscountTypeRule()
    .enforceDiscountValueRule()
    .enforceApplyTargetRule()
    .enforceDateRangeRule()
    .enforceUsageLimitRule()
    .build();
    
    const { error, value } = schemaDiscount.validate(payload);
    console.log("Value : "+JSON.stringify(value));

  if (error) {
    return next({
      statusCode: 400,
      message: "Invalid discount data",
      errors: error.details.map(e => ({
        field: e.path.join("."),
        message: e.message
      }))
    });
  }

  return new OK({
    message: "Create success",
    metadata: await DiscountServices.createDiscount(value)
  }).send(res);
});


const getAllDiscountCodeByShop = asyncHandler(async (req,res,next) =>{

  const shopId = req.user.shopId;

  return new OK({
      message: "Success",
      metadata: await DiscountServices.getAllDiscountCodeByShop({shopId})
    }).send(res);
})

const getAllProductByDiscountCode = asyncHandler(async (req,res,next) => {
    const {code} = req.params;

    if (!code) throw new BadRequestError({
      message : "Missing discount code !!!"
    });
    return new OK({
      message: "Success",
      metadata: await DiscountServices.getAllProductByDiscountCode({discount_code : code})
    }).send(res);
})


const getAmountDiscount = asyncHandler(async (req,res,next) => {

  const userId = req.headers['x-userId-id'];

  const {products,...payload} = req.body;
  
  const schemaDiscount = new DiscountJoiBuilder()
    .require([
      "discount_code",
      "discount_shop"
    ]).build()

  const {error,value} = schemaDiscount.validate(payload);

  if (error) {
    return next({
      statusCode: 400,
      message: "Invalid discount data",
      errors: error.details.map(e => ({
        field: e.path.join("."),
        message: e.message
      }))
    });
  }

  const {discount_code,discount_shop} = value;

  return new OK({
      message: "Success",
      metadata: await DiscountServices.getDiscountAmount({discount_code,userId,discount_shop,products})
  }).send(res)
})



const deleteDiscountCode = asyncHandler(async (req,res,next) => {

   const shopId = req.user.shopId;

   const discount_code = req.params.code;

  return new OK({
    message : "Delete success",
    metadata : await DiscountServices.deleteDiscountCode({discount_shop : shopId,discount_code})
  }).send(res);
})

module.exports ={
    createDiscount,
    getAllDiscountCodeByShop,
    getAllProductByDiscountCode,
    getAmountDiscount,
    deleteDiscountCode
}
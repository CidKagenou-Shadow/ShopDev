const { ExistedError, BadRequestError, NotFoundError } = require("../../core/response/error.response");
const { DiscountModel } = require("../../models/discount/discount.model");
const {productModel} = require("../../models/product/product.model");
const { getAllDiscountCode, getDiscount } = require("../../models/repositories/discount.repo");
const { findAllProduct, setPublishedProduct } = require("../../models/repositories/product.repo");
const { toObjectId } = require("../../utils/database.util");



class DiscountServices{
    static createDiscount = async (payload) => {

        const found = await DiscountModel.findOne({
            discount_shop :payload.discount_shop,
            discount_code :payload.discount_code
        }).lean()

        if (found) throw new ExistedError({
            message : "Voucher existed !!!"
        });

        if (payload.product_ids?.length){ //just run when than 1 product
            const productIds = payload.product_ids.map(id => id.toString());

            const products = await productModel.find({
                _id : {$in : productIds}
            }).select('_id').lean()
            
            const existingIdSet = new Set(
                products.map(p => p._id.toString())
            );

            const invalidProductId = productIds.find(
                id => !existingIdSet.has(id)
            )

            if (invalidProductId) {
                throw new BadRequestError(
                    `Product not found: ${invalidProductId}`
                );
            }
        }

        const newVourcher =  await DiscountModel.create(payload);

        if (!newVourcher) throw new BadRequestError({
            message : "Creating new vourcher failled !!!"
        })

        return newVourcher;
    }

    static getAllDiscountCodeByShop = async ({shopId}) => {

        const options = {
            discount_shop : shopId
        };
        const skip = 0;
        const limit = 10;

        return  await getAllDiscountCode(options,skip,limit);

    }

    static getAllProductByDiscountCode = async ({ discount_code }) => {
        const discount = await DiscountModel.findOne({
            discount_code,
            is_active: true
        }).lean();

        if (!discount) {
            throw new NotFoundError({
            message: "Discount not found !!!"
            });
        }

        if (discount.applies_to !== "specific_products") {
            throw new BadRequestError({
            message: "Discount does not apply to specific products"
            });
        }

        if (!discount.product_ids || discount.product_ids.length === 0) {
            return [];
        }

        const options = {
            _id: { $in: discount.product_ids },
            isPublished: true
        };

        return await findAllProduct(options, 0, 0);
    }


    static getDiscountAmount = async ({discount_code,userId,discount_shop,products}) => {

        const options = {
            discount_code,
            discount_shop : toObjectId(discount_shop),
            is_active : true
        }

        const discount = await getDiscount(options)

        if (!discount) throw new NotFoundError({
            message : "Discount not found !!!"
        });

        const {
            start_date,
            end_date,
            total_uses,
            max_uses,
            min_order_value,
            max_uses_per_user,
            used_by_users,
            discount_type,
            discount_value,
            product_ids
        } = discount;

        const now = new Date();

        if (now < start_date ||now > end_date ) throw new BadRequestError({
            message : "Discount expired or not started"
        });

        if (total_uses >= max_uses) throw new BadRequestError({
            message : "Discount usage limit reached"
        });

        if (max_uses_per_user > 0){
            const userUsed = used_by_users.find(user => {
                user.userId.toString() === userId.toString()
            })

            const userUsedCount = userUsed ? userUsed.number_uses : 0;

            if (userUsedCount >= max_uses_per_user) throw new BadRequestError({
                message : "User has reached the maxium usage limit for this discount !!!"
            })
        }

        if (product_ids.length > 0) {
            const validProductIds = product_ids.map(id => id.toString());

            const hasInvalidProduct = products.some(
                p => !validProductIds.includes(p.productId.toString())
            );

            if (hasInvalidProduct) {
                throw new BadRequestError({
                    message : "Voucher is not applicable to one or more products in the order"
                });
            }
        }
        let total_order = 0;
        if (min_order_value > 0){
            total_order = products.reduce((total,product) => total += (product.quantity*product.price),0);

            if (total_order < min_order_value) throw new BadRequestError({
                message : "Total amount order less than min order value !!!"
            })
        }

        let discountAmount = discount_type === "fixed"?discount_value:(total_order*discount_value)/100;

        discountAmount = Math.min(discountAmount, total_order);

        return {
            total_order,
            discount : discountAmount,
            total_amount : total_order - discountAmount
        }
    }

    static deleteDiscountCode = async ({discount_shop,discount_code}) => {
        const discountDeleted = await DiscountModel.findOneAndDelete({
            discount_shop,
            discount_code
        });

        if (!discountDeleted) throw new BadRequestError({
            message : "discount not found !!"
        });


        return {
            discount_code: discountDeleted.discount_code,
            deletedAt: new Date()
        };
    }

    static cancelDiscountCode = async ({discount_code,userId,discount_shop}) => {

    }
};


module.exports = {
    DiscountServices
};

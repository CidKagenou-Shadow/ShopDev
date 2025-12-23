const { BadRequestError, NotFoundError } = require("../../core/response/error.response");
const { clothingModel } = require("../../models/product/clothing.product.model");
const {electronicModel} = require("../../models/product/electronic.product.model");
const { productModel } = require("../../models/product/product.model");
const mongoose = require('mongoose');
const { getDataInfo } = require("../../utils/getDataInfo.util");
const { findAllProduct, findAllProductDraft, findAllProductPublished, findProduct, setDraftProduct, setPublishedProduct, updateProduct } = require("../../models/repositories/product.repo");
const { toObjectId, cleanNull } = require("../../utils/database.util");
const { insertInventory, removeInventory } = require("../../models/repositories/inventory.repo");

class ProductServices{

    static typeProductRegistry = {};

    static registerTypeProduct(type,refClass){
        this.typeProductRegistry[type] = refClass;
    }

    static async createProduct(data){
        const classRef = this.typeProductRegistry[data.type];
        if (!classRef) throw new NotFoundError("Not found type product !!!");

        return await (new classRef(data).createProduct());
    }

    static async getAllProduct({shopId}){
        const start = 0;
        const limit = 0;
        const products = await findAllProduct({shopId,start,limit});
        return {
            "product list" : getDataInfo(['_id','name','category','tags','price',
                    'stock','description','attributes','status','product_shop','images','slug','sku','isDraft','isPublished'],products)
        }
    }
     static async getAllProductDraft({shopId}){
        const products = await findAllProductDraft({shopId});
        return {
            "product list" : getDataInfo(['_id','name','category','tags','price',
                    'stock','description','attributes','status','product_shop','images','slug','sku','isDraft','isPublished'],products)
        }
    }

    static async getAllProductPublished({shopId}){
        const products = await findAllProductPublished({shopId});
        return {
            "product list" : getDataInfo(['_id','name','category','tags','price',
                    'stock','description','attributes','status','product_shop','images','slug','sku','isDraft','isPublished'],products)
        }
    }

    static async getProduct({productId}){
        const products = await findProduct({productId});
        return {
            "product list" : getDataInfo(['_id','name','category','tags','price',
                    'stock','description','attributes','status','product_shop','images','slug','sku','isDraft','isPublished'],products)
        }
    }

    static async setPublished({shopId,productIdList}){
        const result = await setPublishedProduct({shopId,productIdList});
        return {
            "result" : result
        }
    }

    static async setDraft({shopId,productIdList}){
        const result = await setDraftProduct({shopId,productIdList});
        return {
            "result" : result
        }
    }

    static async removeProduct({type,product_shop,productId}){
        const classRef = this.typeProductRegistry[type];
        if (!classRef) throw new NotFoundError("Not found type product !!!");

        return await (new classRef().removeProduct({product_shop,productId})); 
    }

    static async updateProduct({shopId,payload}){
        const {type,productId} = payload;
        const classRef = this.typeProductRegistry[type];
        if (!classRef) throw new NotFoundError("Not found type product !!!");

        return await (new classRef().updateProduct(
            {product_shop : shopId,productId,payload : cleanNull(payload)}
        ))
    }
    


}

class Product{
    constructor({name,category,price,stock,description,attributes,product_shop} = {}){
        this.name = name;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.description = description;
        this.attributes = attributes;
        this.product_shop = new mongoose.Types.ObjectId(product_shop);
    }

    async createProduct(productId,session){
        const product =  await productModel.create([{
           _id : productId,
            ...this
        }],{session});


        await insertInventory({
            productId,
            product_shop : this.product_shop,
            product_quantity : this.stock
        },{session});

        return product;
    }

    async removeProduct({product_shop,productId},{session}){
        
        const inventory = await removeInventory(
            {
                product_shop,
                productId
            },
            { session }
        )

        if (!inventory) {
            throw new BadRequestError('Inventory not found')
        }


        return await productModel.deleteOne({
            product_shop,
            _id : productId
        },{session})
    }

    async updateProduct({product_shop,productId,payload},{session}){
        const filter = {product_shop,_id : productId};
        const update = {...payload};
        const options = {
            new : true,
            session
        }
        return await updateProduct(
            {filter,update,options},
            productModel
        );
    }
}

class Clothing extends Product{
    async createProduct(){
        const session = await mongoose.startSession();

        try{
            session.startTransaction();

            const [newClothing] = await clothingModel.create([this.attributes],{session});
            if (!newClothing) throw new BadRequestError({
                message : "Create product failled !!!"
            })
            const [newProduct] = await super.createProduct(newClothing._id,session);

            if (!newProduct) throw new BadRequestError({
                message : "Create product failled !!!"
            })

            await session.commitTransaction(); 
            return {
                "product" : getDataInfo(['_id','name','category','tags','price',
                    'stock','description','attributes','status','product_shop','images','slug','sku'],newProduct)
            };
        }catch(err){
            await session.abortTransaction();
            console.log(err.message)
            throw new BadRequestError("Create new product failed!")
        }finally{
            session.endSession();
        }
    }

    async removeProduct({productId,product_shop}){
        const session = await mongoose.startSession();
        try{
            session.startTransaction();
            const result1 = await clothingModel.deleteOne({
                _id : productId
            },{
                session
            })

            if (result1.deletedCount === 0) throw new NotFoundError({
                message : "Product not found !"
            });

            const result2 = await super.removeProduct(
                {product_shop,productId},
                {session}
            )

            if (result2.deletedCount === 0) throw new NotFoundError({
                message : "Product not found !"
            });

            await session.commitTransaction();

            return {
                result1,
                result2
            }
        }catch(error){
            console.log(error.message)
            throw new BadRequestError({
                message : "Remove product failed! " + error.message
            })
        }finally{
            session.endSession();
        }
    }
    

    async updateProduct({product_shop,productId,payload}){
        const session =  await mongoose.startSession();
        try{
            session.startTransaction();
            if (payload.attributes){

                const clothingUpdate = await updateProduct({
                    filter : {_id : toObjectId(productId)},
                    update : payload.attributes,
                    options : {
                        new : true,
                        session
                    }
                },clothingModel);

                console.log("clothing udated : "+clothingUpdate);

                if (!clothingUpdate) throw new BadRequestError({
                    message : "updating clothing failed !"
                })

                const { createdAt, updatedAt, __v, _id, ...cleanAttributes } = clothingUpdate;

                payload.attributes = cleanAttributes;

                console.log("clean attribute : "+ JSON.stringify(cleanAttributes));
            }

            const productUpdate = await super.updateProduct(
                {
                    product_shop,
                    productId,
                    payload
                },
                {session}
            )

            await session.commitTransaction();

            return {
                "product" : getDataInfo(['_id','name','category','tags','price',
                    'stock','description','attributes','status','product_shop','images','slug','sku'],productUpdate)
            };

        }catch(error){
            await session.abortTransaction();
            throw new BadRequestError({
                message : "Update product fail ! " + error
            });
        }finally{
            session.endSession();
        }
    }
}

class Electronic extends Product{
    async createProduct(){
        const session = await mongoose.startSession();
        try{
            session.startTransaction();
            const [newElectronic] = await electronicModel.create([this.attributes],{session});
            if (!newElectronic) throw new BadRequestError({
                message : "Create product failled !!!"
            })
            const [newProduct] = await super.createProduct(newElectronic._id,session);

            if (!newElectronic) throw new BadRequestError({
                message : "Create product failled !!!"
            })
            await session.commitTransaction();
            return {
                "product" : getDataInfo(['_id','name','category','tags','price',
                    'stock','description','attributes','status','product_shop','images','slug','sku'],newProduct)
            };
            
        }catch(err){
            await session.abortTransaction();
            throw new BadRequestError({
                message : "Create new product failed! Error : " + err
            });
        }finally{
            session.endSession();
        }
    }


    async removeProduct({productId,product_shop}){
        const session = await mongoose.startSession();
        try{
            session.startTransaction();
            const result1 = await electronicModel.deleteOne({
                _id : productId
            },{
                session
            })

            if (result1.deletedCount === 0) throw new NotFoundError({
                message : "Product not found !"
            });

            const result2 = await super.removeProduct(
                {product_shop,productId},
                {session}
            )

            if (result2.deletedCount === 0) throw new NotFoundError({
                message : "Product not found !"
            });

            await session.commitTransaction();

            return {
                result1,
                result2
            }
        }catch(error){
            await session.abortTransaction();
            console.log(err.message)
            throw new BadRequestError({
                message : "Remove product failed!" + error.message
            })
        }finally{
            session.endSession();
        }
    }


    async updateProduct({product_shop,productId,payload}){
        const session =  await mongoose.startSession();
        try{
            session.startTransaction();
            if (payload.attributes){

                const electronicUpdated = await updateProduct({
                    filter : {_id : toObjectId(productId)},
                    update : payload.attributes,
                    options : {
                        new : true,
                        session
                    }
                },electronicModel);

                if (!electronicUpdated) throw new BadRequestError({
                    message : "updating clothing failed !"
                })

                const { createdAt, updatedAt, __v, _id, ...cleanAttributes } = electronicModel;

                payload.attributes = cleanAttributes;
            }

            return await super.updateProduct(
                {
                    product_shop,
                    productId,
                    payload
                }
            )

        }catch(error){
            await session.abortTransaction();
            throw new BadRequestError({
                message : "Update product fail ! " + e
            });
        }finally{
            session.endSession();
        }
    }
}

ProductServices.registerTypeProduct('clothing', Clothing);
ProductServices.registerTypeProduct('electronic', Electronic);


module.exports = {
    ProductServices
}
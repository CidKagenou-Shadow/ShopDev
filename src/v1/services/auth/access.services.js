const {    
    findShopByEmail,
    createShop,
} = require("../../models/repositories/shop.repo.js");

const {
    signTokenPair
} = require("../../auth/tokens.auth.js");

const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const { createKeyModel } = require("./key.services.js");
const { getDataInfo } = require("../../utils/getDataInfo.util.js");
const { ErrorResponse, UnauthorizedError, NotFoundError, ExistedError } = require("../../core/response/error.response.js");
const { OK } = require("../../core/response/success.response.js");

const ROLES = {
    SHOP: 'shop',
    ADMIN: 'admin',
    USER: 'user'
}
const loginShopService = async (email, password) => {
    const shop = await findShopByEmail(email);


    if (!shop) throw new NotFoundError({message : "Shop not found"});

    const isPasswordValid = await bcrypt.compare(password, shop.password);

    if (!isPasswordValid) throw new UnauthorizedError({message : "Invalid credentials"});
    const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    const publicKeyString = await createKeyModel({
        userId: shop._id,
        publicKey
    });

    if (!publicKeyString) throw new ErrorResponse({message : "Error creating public key for shop",statusCode : 500})

    const tokens = signTokenPair(
        {
            payload : { shopId: shop._id, roles: shop.roles },
            publicKey : publicKeyString,
            privateKey
        }
    );

    return {
        tokens,
        shop : getDataInfo(['_id', 'name', 'email', 'roles'],shop)
    }
}


const registerShopService = async ({email, password, name}) => {
    const existingShop = await findShopByEmail(email);
    if (existingShop) throw new ExistedError({message : "Shop with this email already exists"});

    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = await createShop({
        name,
        email,
        hashedPassword,
        roles : [ROLES.SHOP]
    });

    const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });

    const publicKeyString = await createKeyModel({
        userId: newShop._id,
        publicKey
    });

    if (!publicKeyString) throw new ErrorResponse({message : "Error creating public key for shop",statusCode : 500})

    const tokens = signTokenPair(
        {
            payload : { shopId: newShop._id, roles: newShop.roles },
            publicKey : publicKeyString,
            privateKey
        }
    );

    return {
        tokens,
        shop : getDataInfo(['_id', 'name', 'email', 'roles'],newShop)
    }
}

module.exports = {
    loginShopService,
    registerShopService
};
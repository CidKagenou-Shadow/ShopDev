const {    
    findShopByEmail,
    createShop
} = require("../../models/repositories/shop.repo.js");

const {
    signTokenPair,
    verfifyToken
} = require("../../auth/tokens.auth.utils.js");

const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const { createKeyModel, removeKeyByUserId, checkRefreshTokenUsed, removeKeyStore, findKeyByUserId, addRefreshTokenUsed } = require("./key.services.js");
const { getDataInfo } = require("../../utils/getDataInfo.util.js");
const { ErrorResponse, UnauthorizedError, NotFoundError, ExistedError, ForbiddenError } = require("../../core/response/error.response.js");
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

const logoutShopService = async (shopId) => {
    if (!shopId) throw new NotFoundError({message: "Shop ID is required for logout"});

    const result = await removeKeyByUserId(shopId);

    if (result.deletedCount === 0) {
        throw new NotFoundError({message: "No active session found for this shop"});
    }

    return result;
}

const handlerRefreshToken = async (userId,refreshToken) => {
    const keyStore = await findKeyByUserId(userId);
    if (!keyStore) throw new NotFoundError({message: "KeyStore not found"});

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
        await removeKeyStore(userId);
        throw new ForbiddenError({message: "Refresh token reuse detected. All sessions revoked."});
    }
    const decoded = verfifyToken(refreshToken, keyStore.publicKey);
    if (!decoded) throw new UnauthorizedError({message: "Invalid refresh token"});

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

    const newKeyStore = await addRefreshTokenUsed(userId,refreshToken,publicKey.toString());

    if (!newKeyStore) throw new ErrorResponse({
        statusCode : 500,
        message : "Error update keyStore !"
    })
    const tokens = signTokenPair(
        {
            payload : { shopId: decoded.shopId, roles: decoded.roles },
            publicKey : newKeyStore.publicKey,
            privateKey
        }
    );



    return {
        tokens : tokens
    }

}
module.exports = {
    loginShopService,
    registerShopService,
    logoutShopService,
    handlerRefreshToken
};
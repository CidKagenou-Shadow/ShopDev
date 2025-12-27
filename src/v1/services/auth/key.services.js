const keySchema = require('../../models/auth/key.model.js');


const createKeyModel = async ({
    userId, publicKey
}) => {
    try{
        const publicKeyString = publicKey.toString();

        const filters = { user: userId };

        const update = {
            publicKey: publicKeyString,
            refreshTokensUsed: []

        };

        const option = { new: true, upsert: true };

        const token = await keySchema.findOneAndUpdate(
            filters,
            update,
            option
        );
        return token?token.publicKey:null; 
    }
    catch(err){
        console.error("Error creating key model: ",err);
        return null;
    }
}

const findKeyByUserId = async (key) => {
    return await keySchema.findOne({ user: key }).lean()
}

const removeKeyByUserId = async (userId) => {
    return await keySchema.deleteOne({ user: userId });
}


const checkRefreshTokenUsed = async (refreshToken) =>{
    return await keySchema.findOne({ refreshTokensUsed: refreshToken }).lean();
}

const removeKeyStore = async (userId) => {
    return await keySchema.deleteOne({ user: userId });
}

const addRefreshTokenUsed = async (userId, refreshToken,newPublicKey) => {
    return await keySchema.findOneAndUpdate(
        { user: userId },                     
        {
            publicKey : newPublicKey,                     
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        }
  ).lean();
};
module.exports = {
    createKeyModel,
    findKeyByUserId,
    removeKeyByUserId,
    checkRefreshTokenUsed,
    removeKeyStore,
    addRefreshTokenUsed
};
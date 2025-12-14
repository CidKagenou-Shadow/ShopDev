const keySchema = require('../../models/key.model.js');


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

const findKeyByUserId = async (userId) => {
    return await keySchema.findOne({ user: userId });
}


module.exports = {
    createKeyModel,
    findKeyByUserId
};
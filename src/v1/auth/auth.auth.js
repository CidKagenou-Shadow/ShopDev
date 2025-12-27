const { UnauthenticatedError, NotFoundError } = require("../core/response/error.response.js");
const {asyncHandler} = require("../helpers/asyncHandler.helpers.js");
const { findKeyByUserId } = require("../services/auth/key.services.js");
const jwt = require('jsonwebtoken');

const authentications = asyncHandler(async (req,res,next)=>{
    //check client-id
    const clientId = req.headers['x-client-id'];
    if(!clientId) throw new NotFoundError({message: "Client ID is missing"});

    //check token
    const keyStore = await findKeyByUserId(clientId);
    if(!keyStore) throw new NotFoundError({message: "KeyStore not found"});


    const accessToken = req.headers['authorization'];
    if(!accessToken) throw new UnauthenticatedError({message: "Access token is missing"});

    try{
        //verify token
        const decoded = jwt.verify(accessToken, keyStore.publicKey);

        console.log("Fuck YOUR FATHER")
        if (!decoded) throw new UnauthenticatedError({message: "Invalid access token"});

        console.log("Decode : "+JSON.stringify(decoded));

        req.keyStore = keyStore;
        req.user = decoded;

        return next();
    } catch (err) {
        throw new UnauthenticatedError({message: "Invalid access token"});
    }
})

module.exports = {
    authentications
}
const apiKeyService = require("../../services/auth/apiKey.services.js");
const {asyncHandler} = require("../../helpers/asyncHandler.helpers.js")

const AutoCreateApiKeyMiddleware =  () => {
    try{
        const apiKey =  apiKeyService.createApiKey({ permissions: "0000" });
    }catch(err){
        console.log("error : " + err.message);
    }
};

const checkApiKey = asyncHandler( async (req,res,next) => {
    const apiKey = req.headers['x-api-key'];
    if(!apiKey){
        return res.status(401).json({message: "API Key is missing"});
    }
    const keyStore = await apiKeyService.findApiKeyByKey(apiKey);
    if(!keyStore){
        return res.status(403).json({message: "Invalid API Key"});
    }

    req.apiKey = keyStore;

    next();
});


const checkPermission = (requiredPermission) => {
    return asyncHandler( async (req,res,next) => {
        const apiKey = req.apiKey;
        if(!apiKey){
            return res.status(401).json({message: "API Key is missing"});
        }
        if(!apiKey.permissions.includes(requiredPermission)){
            return res.status(403).json({message: "Insufficient permissions"});
        }
        next();
    });
}

module.exports = {
    AutoCreateApiKeyMiddleware,
    checkApiKey,
    checkPermission
}
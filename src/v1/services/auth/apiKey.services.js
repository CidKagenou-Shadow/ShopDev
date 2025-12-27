const crypto = require('crypto');
const ApiKeyRepo = require("../../models/repositories/apiKey.repo.js");
const { ErrorResponse, NotFoundError } = require('../../core/response/error.response.js');

const createApiKey = async ({ permissions }) => {
  const key = crypto.randomBytes(32).toString("hex");

  const apiKey = await ApiKeyRepo.createApiKeyModel({
    key,
    permissions
  });

  return {
    apiKey : apiKey.key
  };
};

const findApiKeyByKey = async (key) => {
  const apiKey = await ApiKeyRepo.findApiKeyByKey(key);
    if (!apiKey) {
        throw new NotFoundError(403, "NotFound API Key");
    }
    return apiKey;
}



module.exports = {
    createApiKey,
    findApiKeyByKey
};
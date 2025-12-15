const apiKeyModel = require("../api.key.model");
const ApiKey = require("../api.key.model");

const createApiKeyModel = ({ key, permissions }) => {
  return ApiKey.create({
    key,
    permissions: Array.isArray(permissions) ? permissions : [permissions]
  });
};


const findApiKeyByKey = (key) => {
  return apiKeyModel.findOne({
    key : key
  })
};

const updatePermissions = (key, permissions) => {
  return ApiKey.findOneAndUpdate(
    { key },
    { permissions: Array.isArray(permissions) ? permissions : [permissions] },
    { new: true }
  );
};

module.exports = {
  createApiKeyModel,
  findApiKeyByKey,
  updatePermissions
};

const { Schema, model } = require("mongoose");
const apiKeySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: {
    type: Array,
    required: true
  },
},{
    timestamps: true
});

module.exports = model("ApiKey", apiKeySchema);
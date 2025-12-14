const mongoose = require('mongoose');

const COLLECTION_NAME = 'KeyCollections';
const DOCUMENT_NAME = 'KeyDocuments';

const KeySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    publicKey: {
        type: String,
        required: true,
        trim: true
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken:{
        type: String,
        default: null
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = mongoose.model(DOCUMENT_NAME, KeySchema);
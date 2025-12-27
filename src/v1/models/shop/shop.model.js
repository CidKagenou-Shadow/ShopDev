const mongoose = require('mongoose')
const COLLECTION_NAME = 'ShopCollections'
const DOCUMENT_NAME = 'ShopDocuments'

const Shop = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        maxLength : 150,
        required : true
    },
    email : {
        type : String,
        unique : true,
        trim : true,
        required : true
    },
    password : {
        type : String,
        required :true
    },
    status : {
        type : String,
        enum : ['active','inactive'],
        default : 'inactive'
    },
    verfity: {
        type :Boolean,
        default : false
    },
    roles : {
        type :Array,
        default : []
    }
},{
    timestamps: true,
    collection : COLLECTION_NAME
})

module.exports = mongoose.model(DOCUMENT_NAME,Shop);
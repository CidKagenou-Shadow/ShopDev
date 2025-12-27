const mongoose =  require('mongoose')
const DOCUMENT_NAME =  'ClothingDocument'
const COLLECTION_NAME = 'ClothingCollection'

const clothingSchema = new mongoose.Schema({
    sizes: {
      type: [String], // S, M, L, XL
      required: true
    },

    colors: {
      type: [String], // black, white, red
      required: true
    },

    material: {
      type: String // cotton, denim, polyester
    },
    season: {
      type: String,
      enum: ['summer', 'winter', 'spring', 'autumn', 'all']
    },

    fit: {
      type: String, // slim, regular, oversize
    },

    brand: {
      type: String
    }
},{
    timestamps: true,
    collection :COLLECTION_NAME
});


module.exports = {
    clothingModel : mongoose.model(DOCUMENT_NAME,clothingSchema)
}
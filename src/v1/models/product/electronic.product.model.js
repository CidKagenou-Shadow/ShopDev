const mongoose =  require('mongoose')
const DOCUMENT_NAME =   'electronicDocument'
const COLLECTION_NAME =  'electronicCollection'

const electronicSchema = new mongoose.Schema({
    brand: {
      type: String,
      required: true
    },

    model: {
      type: String
    },

    specs: {
      type: mongoose.Schema.Types.Mixed
    },

    warrantyMonths: {
      type: Number,
      default: 12
    },

    power: {
      type: String // 220V, 110V, USB-C
    },

    origin: {
      type: String // Vietnam, China, USA
    }
},{
    timestamps : true,
    collection : COLLECTION_NAME
});


module.exports = {
    electronicModel : mongoose.model(DOCUMENT_NAME,electronicSchema)
}
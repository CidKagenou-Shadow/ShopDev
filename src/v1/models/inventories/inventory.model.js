const mongoose = require('mongoose')

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventorySchema = new mongoose.Schema(
{
    inventory_product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    },

    inventory_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
        index: true
    },

    // Tổng số lượng thực tế trong kho
    inventory_stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    // Vị trí kho (nếu có nhiều kho)
    inventory_location: {
        type: String,
        require : true
    },

    // Trạng thái tồn kho
    inventory_status: {
        type: String,
        enum: ['active', 'inactive', 'out_of_stock'],
        default: 'active'
    },
    inventory_reservation : {
        type : Array,
        default : []
    }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
})


inventorySchema.index(
    {inventory_product : 1 , inventory_shop : 1},
    {unique : true}
)

module.exports = {
    inventoryModel: mongoose.model(DOCUMENT_NAME, inventorySchema)
}

const {inventoryModel} = require("../inventories/inventory.model")


const insertInventory = ({productId,product_shop,product_quantity,location},{session}) => {

    const inventory_location = location?location:"unKnow";

    return inventoryModel.create([{
        inventory_product : productId,
        inventory_shop : product_shop,
        inventory_stock : product_quantity,
        inventory_location
    }],{session})
}

const removeInventory = ({productId,product_shop},{session}) => {
    return inventoryModel.findOneAndDelete({
        inventory_product : productId,
        inventory_shop : product_shop
    },{session})
}

module.exports = {
    insertInventory,
    removeInventory
}
const Shop = require('../shop/shop.model.js');


const findShopByEmail = async (email) => {
    return await Shop.findOne({ email: email });
}


const createShop = async ({
    name,
    email,
    hashedPassword,
    roles
}) => {
    const shop = new Shop({
        name: name,
        email: email,
        password: hashedPassword,
        roles : roles
    });

    console.log("Shop : " + shop);
    return await shop.save();
}

const removeShop = async (shopId) => {
    return await Shop.findByIdAndDelete(shopId);
}

module.exports = {
    findShopByEmail,
    createShop,
    removeShop
};